let airports = [];

document.addEventListener('DOMContentLoaded', () => {
    loadAirports();
    
    document.getElementById('searchInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchAirports();
        }
    });
    
    // 管理后台入口彩蛋
    let clickCount = 0;
    let lastClickTime = 0;
    const headerTitle = document.querySelector('header h1');
    const adminEntry = document.querySelector('.admin-entry');
    
    headerTitle.addEventListener('click', () => {
        const currentTime = Date.now();
        if (currentTime - lastClickTime < 500) {
            clickCount++;
        } else {
            clickCount = 1;
        }
        lastClickTime = currentTime;
        
        if (clickCount >= 5) {
            adminEntry.style.display = 'inline-block';
            setTimeout(() => {
                adminEntry.style.display = 'none';
                clickCount = 0;
            }, 5000);
        }
    });
});

async function loadAirports() {
    try {
        const response = await fetch('/api/airports');
        airports = await response.json();
        renderAirportList(airports);
    } catch (error) {
        document.getElementById('airportList').innerHTML = '<p class="no-data">加载失败，请刷新重试</p>';
    }
}

function searchAirports() {
    const query = document.getElementById('searchInput').value.toLowerCase().trim();
    if (!query) {
        renderAirportList(airports);
        return;
    }
    const filtered = airports.filter(a => 
        a.icao.toLowerCase().includes(query) || 
        (a.iata && a.iata.toLowerCase().includes(query)) ||
        a.name.toLowerCase().includes(query) ||
        (a.nameEn && a.nameEn.toLowerCase().includes(query))
    );
    renderAirportList(filtered);
}

function renderAirportList(list) {
    const container = document.getElementById('airportList');
    
    if (list.length === 0) {
        container.innerHTML = '<p class="no-data">暂无机场数据</p>';
        return;
    }
    
    container.innerHTML = list.map(airport => `
        <div class="airport-card" onclick="showFrequency('${airport.icao}')">
            <h3>${airport.name}</h3>
            ${airport.nameEn ? `<p class="name-en">${airport.nameEn}</p>` : ''}
            <div class="code-tags">
                <span class="icao">${airport.icao}</span>
                ${airport.iata ? `<span class="iata">${airport.iata}</span>` : ''}
            </div>
        </div>
    `).join('');
}

async function showFrequency(icao) {
    try {
        const response = await fetch(`/api/airports/${icao}`);
        const airport = await response.json();
        
        let nameHtml = airport.name;
        if (airport.nameEn) {
            nameHtml += ` <span class="name-en-inline">${airport.nameEn}</span>`;
        }
        document.getElementById('airportName').innerHTML = nameHtml;
        
        let icaoHtml = airport.icao;
        if (airport.iata) {
            icaoHtml += ` / ${airport.iata}`;
        }
        document.getElementById('airportIcao').textContent = icaoHtml;
        
        renderFrequencies(airport.frequencies);
        
        document.getElementById('airportList').style.display = 'none';
        document.getElementById('frequencyDisplay').style.display = 'block';
    } catch (error) {
        alert('加载机场数据失败');
    }
}

const TYPE_NAMES = {
    'D-ATIS': '数据链航站自动情报服务',
    'APP': '进近',
    'TWR': '塔台',
    'APN': '机坪',
    'GND': '地面',
    'Delivery': '放行'
};

function renderFrequencies(frequencies) {
    const container = document.getElementById('frequencyList');
    const legendContainer = document.getElementById('typeLegend');
    
    if (!frequencies || frequencies.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #888; padding: 20px;">暂无频率数据</p>';
        legendContainer.innerHTML = '';
        return;
    }
    
    const usedTypes = [...new Set(frequencies.map(f => f.type))];
    legendContainer.innerHTML = `
        <div class="legend-title">无线电类型说明</div>
        <div class="legend-items">
            ${usedTypes.map(type => {
                const typeClass = type.toLowerCase().replace('-', '');
                return `<span class="type-badge ${typeClass}">${type}（${TYPE_NAMES[type] || type}）</span>`;
            }).join('')}
        </div>
    `;
    
    container.innerHTML = frequencies.map(freq => {
        const typeClass = freq.type.toLowerCase().replace('-', '');
        let html = '<div class="frequency-item">';
        
        let badgeText = freq.type;
        if (freq.number) {
            badgeText += ` ${String(freq.number).padStart(2, '0')}`;
        }
        html += `<span class="type-badge ${typeClass}">${badgeText}</span>`;
        
        if (freq.preRemark) {
            html += `<span class="pre-remark">(${freq.preRemark})</span>`;
        }
        
        html += `<span class="frequency">${freq.frequency}</span>`;
        
        if (freq.backup) {
            html += `<span class="backup">(${freq.backup})</span>`;
        }
        
        html += '<span class="unit">MHz</span>';
        
        if (freq.postRemark) {
            html += `<span class="post-remark">(${freq.postRemark})</span>`;
        }
        
        if (freq.type === 'Delivery' && !freq.postRemark) {
            html += '<span class="default-remark">(DCL AVBL)</span>';
        }
        
        html += '</div>';
        return html;
    }).join('');
}

function hideFrequency() {
    document.getElementById('airportList').style.display = 'grid';
    document.getElementById('frequencyDisplay').style.display = 'none';
}
