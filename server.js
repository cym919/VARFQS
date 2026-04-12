const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

const DATA_DIR = path.join(__dirname, 'data');

app.use(express.json());
app.use(express.static('public'));

if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

app.get('/api/airports', (req, res) => {
    try {
        const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));
        const airports = files.map(file => {
            const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
            return { 
                icao: data.icao, 
                iata: data.iata || '',
                name: data.name, 
                nameEn: data.nameEn || '',
                frequencyCount: data.frequencies ? data.frequencies.length : 0,
                updatedAt: data.updatedAt
            };
        });
        res.json(airports);
    } catch (error) {
        res.status(500).json({ code: 500, error: '读取机场列表失败' });
    }
});

app.get('/api/airports/:icao', (req, res) => {
    try {
        const filePath = path.join(DATA_DIR, `${req.params.icao.toUpperCase()}.json`);
        if (fs.existsSync(filePath)) {
            const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            res.json(data);
        } else {
            res.status(404).json({ code: 404, error: '机场不存在' });
        }
    } catch (error) {
        res.status(500).json({ code: 500, error: '读取机场数据失败' });
    }
});

app.post('/api/airports', (req, res) => {
    try {
        const { icao, iata, name, nameEn, frequencies } = req.body;
        if (!icao || !name) {
            return res.status(400).json({ code: 400, error: 'ICAO代码和机场名称不能为空' });
        }
        const airportData = {
            icao: icao.toUpperCase(),
            iata: iata ? iata.toUpperCase() : '',
            name,
            nameEn: nameEn || '',
            frequencies: frequencies || [],
            updatedAt: new Date().toISOString()
        };
        const filePath = path.join(DATA_DIR, `${airportData.icao}.json`);
        fs.writeFileSync(filePath, JSON.stringify(airportData, null, 2), 'utf8');
        res.json({ success: true, airport: airportData });
    } catch (error) {
        res.status(500).json({ code: 500, error: '保存机场数据失败' });
    }
});

app.put('/api/airports/:icao', (req, res) => {
    try {
        const icao = req.params.icao.toUpperCase();
        const filePath = path.join(DATA_DIR, `${icao}.json`);
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ code: 404, error: '机场不存在' });
        }
        const existingData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const updatedData = {
            ...existingData,
            ...req.body,
            icao,
            updatedAt: new Date().toISOString()
        };
        fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2), 'utf8');
        res.json({ success: true, airport: updatedData });
    } catch (error) {
        res.status(500).json({ code: 500, error: '更新机场数据失败' });
    }
});

app.delete('/api/airports/:icao', (req, res) => {
    try {
        const icao = req.params.icao.toUpperCase();
        const filePath = path.join(DATA_DIR, `${icao}.json`);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            res.json({ success: true });
        } else {
            res.status(404).json({ code: 404, error: '机场不存在' });
        }
    } catch (error) {
        res.status(500).json({ code: 500, error: '删除机场失败' });
    }
});

app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
});
