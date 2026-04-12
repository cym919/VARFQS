let airports = [];
let deleteIcao = null;
let frequencyCounter = 0;

const FREQUENCY_TYPES = ['D-ATIS', 'APP', 'TWR', 'APN', 'GND', 'Delivery'];
let aiImportResult = [];

document.addEventListener('DOMContentLoaded', () => {
    loadAirports();
    
    document.getElementById('airportForm').addEventListener('submit', saveAirport);
    document.getElementById('settingsForm').addEventListener('submit', saveSettings);
    
    loadSettings();
});

// 加载设置
function loadSettings() {
    const settings = JSON.parse(localStorage.getItem('aiSettings') || '{}');
    document.getElementById('aiApiEndpoint').value = settings.aiApiEndpoint || 'https://api.openai.com/v1/chat/completions';
    document.getElementById('aiApiKey').value = settings.aiApiKey || '';
    document.getElementById('aiModel').value = settings.aiModel || 'gpt-3.5-turbo';
}

// 保存设置
function saveSettings(e) {
    e.preventDefault();
    const settings = {
        aiApiEndpoint: document.getElementById('aiApiEndpoint').value.trim(),
        aiApiKey: document.getElementById('aiApiKey').value.trim(),
        aiModel: document.getElementById('aiModel').value.trim()
    };
    localStorage.setItem('aiSettings', JSON.stringify(settings));
    alert('设置保存成功！');
    closeSettingsModal();
}

// 测试AI连接
async function testAIConnection() {
    const settings = JSON.parse(localStorage.getItem('aiSettings') || '{}');
    if (!settings.aiApiKey) {
        alert('请先填写API密钥');
        return;
    }
    
    try {
        const response = await fetch(settings.aiApiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${settings.aiApiKey}`
            },
            body: JSON.stringify({
                model: settings.aiModel,
                messages: [
                    { role: 'system', content: '你是一个测试助手' },
                    { role: 'user', content: '测试连接' }
                ],
                max_tokens: 10
            })
        });
        
        if (response.ok) {
            alert('连接测试成功！');
        } else {
            const error = await response.json();
            alert(`连接测试失败: ${error.error?.message || '未知错误'}`);
        }
    } catch (error) {
        alert(`连接测试失败: ${error.message}`);
    }
}

// 显示设置模态框
function showSettings() {
    loadSettings();
    document.getElementById('settingsModal').classList.add('show');
}

// 关闭设置模态框
function closeSettingsModal() {
    document.getElementById('settingsModal').classList.remove('show');
}

// 显示AI导入模态框
function showAIImport() {
    document.getElementById('aiImportText').value = '';
    document.getElementById('aiImportPreview').style.display = 'none';
    document.getElementById('aiImportButton').style.display = 'inline-block';
    document.getElementById('aiRegenerateButton').style.display = 'none';
    document.getElementById('aiConfirmButton').style.display = 'none';
    document.getElementById('aiImportModal').classList.add('show');
}

// 关闭AI导入模态框
function closeAIImportModal() {
    document.getElementById('aiImportModal').classList.remove('show');
}

// 处理AI导入
async function processAIImport() {
    const inputText = document.getElementById('aiImportText').value.trim();
    if (!inputText) {
        alert('请输入频率文本');
        return;
    }
    
    const settings = JSON.parse(localStorage.getItem('aiSettings') || '{}');
    if (!settings.aiApiKey) {
        alert('请先在设置中配置AI API密钥');
        return;
    }
    
    document.getElementById('aiImportButton').textContent = '解析中...';
    document.getElementById('aiImportButton').disabled = true;
    
    try {
        const prompt = `你是一个机场无线电频率数据解析助手。请将用户输入的原始频率文本解析为JSON格式。

## 输入格式说明
用户输入的是未经处理的频率文本，每行一个频率，格式可能包含：
- 类型（D-ATIS/APP/TWR/APN/GND/Delivery）
- 序号（如TWR01中的01）
- 前备注（类型后括号内的内容，如D-ATIS(Chinese)中的Chinese）
- 频率值（数字，单位MHz）
- 备用频率（频率后括号内的纯数字）
- 后备注（频率后括号内的文字说明，如DCL AVBL）

## 排序规则
按以下顺序排列：
1. D-ATIS
2. APP（按序号升序）
3. TWR（按序号升序）
4. APN（按序号升序）
5. GND（按序号升序）
6. Delivery（按序号升序）

## 输出要求
仅输出纯JSON数组，不要包含任何解释文字或markdown代码块标记。

JSON格式：
[
  {
    "type": "类型",
    "number": 序号数字或null,
    "preRemark": "前备注或null",
    "frequency": "频率值",
    "backup": "备用频率或null",
    "postRemark": "后备注或null"
  }
]

## 用户输入：
${inputText}`;
        
        const response = await fetch(settings.aiApiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${settings.aiApiKey}`
            },
            body: JSON.stringify({
                model: settings.aiModel,
                messages: [
                    { role: 'system', content: '你是一个机场无线电频率数据解析助手' },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.1
            })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'API调用失败');
        }
        
        const result = await response.json();
        const content = result.choices[0].message.content.trim();
        
        // 尝试解析JSON
        aiImportResult = JSON.parse(content);
        
        // 显示预览
        displayAIImportPreview(aiImportResult);
        
        // 切换按钮状态
        document.getElementById('aiImportButton').style.display = 'none';
        document.getElementById('aiRegenerateButton').style.display = 'inline-block';
        document.getElementById('aiConfirmButton').style.display = 'inline-block';
        
    } catch (error) {
        alert(`解析失败: ${error.message}`);
    } finally {
        document.getElementById('aiImportButton').textContent = '解析';
        document.getElementById('aiImportButton').disabled = false;
    }
}

// 显示AI导入预览
function displayAIImportPreview(frequencies) {
    const tbody = document.getElementById('aiImportPreviewBody');
    tbody.innerHTML = frequencies.map(freq => `
        <tr>
            <td>${freq.type}</td>
            <td>${freq.number || '-'}</td>
            <td>${freq.preRemark || '-'}</td>
            <td>${freq.frequency}</td>
            <td>${freq.backup || '-'}</td>
            <td>${freq.postRemark || '-'}</td>
        </tr>
    `).join('');
    document.getElementById('aiImportPreview').style.display = 'block';
}

// 确认AI导入
function confirmAIImport() {
    if (aiImportResult.length === 0) return;
    
    // 清空现有频率
    document.getElementById('frequencyEditor').innerHTML = '';
    frequencyCounter = 0;
    
    // 添加解析的频率
    aiImportResult.forEach(freq => addFrequencyRow(freq));
    
    closeAIImportModal();
    alert('频率导入成功！');
}

async function loadAirports() {
    try {
        const response = await fetch('/api/airports');
        airports = await response.json();
        renderAirportTable();
    } catch (error) {
        document.getElementById('airportTableBody').innerHTML = '<tr><td colspan="6" class="loading">加载失败</td></tr>';
    }
}

function renderAirportTable() {
    const tbody = document.getElementById('airportTableBody');
    
    if (airports.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: #888;">暂无机场数据，点击"添加机场"开始</td></tr>';
        return;
    }
    
    tbody.innerHTML = airports.map(airport => `
        <tr>
            <td><strong>${airport.icao}</strong></td>
            <td>${airport.iata || '-'}</td>
            <td>${airport.name}${airport.nameEn ? `<br><small style="color:#666">${airport.nameEn}</small>` : ''}</td>
            <td>${airport.frequencyCount || 0}</td>
            <td>${airport.updatedAt ? new Date(airport.updatedAt).toLocaleString('zh-CN') : '-'}</td>
            <td class="actions">
                <button class="btn-edit" onclick="editAirport('${airport.icao}')">编辑</button>
                <button class="btn-delete" onclick="deleteAirport('${airport.icao}', '${airport.name}')">删除</button>
            </td>
        </tr>
    `).join('');
}

function showAddAirport() {
    document.getElementById('modalTitle').textContent = '添加机场';
    document.getElementById('editIcao').value = '';
    document.getElementById('airportIcaoInput').value = '';
    document.getElementById('airportIcaoInput').disabled = false;
    document.getElementById('airportIataInput').value = '';
    document.getElementById('airportNameInput').value = '';
    document.getElementById('airportNameEnInput').value = '';
    document.getElementById('frequencyEditor').innerHTML = '';
    frequencyCounter = 0;
    addFrequencyRow();
    document.getElementById('airportModal').classList.add('show');
}

async function editAirport(icao) {
    try {
        const response = await fetch(`/api/airports/${icao}`);
        const airport = await response.json();
        
        document.getElementById('modalTitle').textContent = '编辑机场';
        document.getElementById('editIcao').value = airport.icao;
        document.getElementById('airportIcaoInput').value = airport.icao;
        document.getElementById('airportIcaoInput').disabled = true;
        document.getElementById('airportIataInput').value = airport.iata || '';
        document.getElementById('airportNameInput').value = airport.name;
        document.getElementById('airportNameEnInput').value = airport.nameEn || '';
        
        document.getElementById('frequencyEditor').innerHTML = '';
        frequencyCounter = 0;
        
        if (airport.frequencies && airport.frequencies.length > 0) {
            airport.frequencies.forEach(freq => addFrequencyRow(freq));
        } else {
            addFrequencyRow();
        }
        
        document.getElementById('airportModal').classList.add('show');
    } catch (error) {
        alert('加载机场数据失败');
    }
}

function addFrequencyRow(data = null) {
    frequencyCounter++;
    const editor = document.getElementById('frequencyEditor');
    const row = document.createElement('div');
    row.className = 'frequency-row';
    row.id = `freq-${frequencyCounter}`;
    
    row.innerHTML = `
        <div>
            <label class="row-label">类型</label>
            <select class="freq-type">
                ${FREQUENCY_TYPES.map(t => `<option value="${t}" ${data && data.type === t ? 'selected' : ''}>${t}</option>`).join('')}
            </select>
        </div>
        <div>
            <label class="row-label">序号</label>
            <input type="number" class="freq-number" placeholder="序号" min="1" value="${data && data.number ? data.number : ''}">
        </div>
        <div>
            <label class="row-label">前备注</label>
            <input type="text" class="freq-pre-remark" placeholder="前备注" value="${data && data.preRemark ? data.preRemark : ''}">
        </div>
        <div>
            <label class="row-label">频率 (MHz) *</label>
            <input type="text" class="freq-value" placeholder="如: 118.1" required value="${data && data.frequency ? data.frequency : ''}">
        </div>
        <div>
            <label class="row-label">备用频率</label>
            <input type="text" class="freq-backup" placeholder="备用" value="${data && data.backup ? data.backup : ''}">
        </div>
        <div>
            <label class="row-label">后备注</label>
            <input type="text" class="freq-post-remark" placeholder="后备注" value="${data && data.postRemark ? data.postRemark : ''}">
        </div>
        <button type="button" class="remove-btn" onclick="removeFrequencyRow(${frequencyCounter})">×</button>
    `;
    
    editor.appendChild(row);
}

function removeFrequencyRow(id) {
    const row = document.getElementById(`freq-${id}`);
    if (row) {
        row.remove();
    }
}

function closeModal() {
    document.getElementById('airportModal').classList.remove('show');
}

async function saveAirport(e) {
    e.preventDefault();
    
    const editIcao = document.getElementById('editIcao').value;
    const icao = document.getElementById('airportIcaoInput').value.toUpperCase().trim();
    const iata = document.getElementById('airportIataInput').value.toUpperCase().trim();
    const name = document.getElementById('airportNameInput').value.trim();
    const nameEn = document.getElementById('airportNameEnInput').value.trim();
    
    if (!icao || !name) {
        alert('请填写ICAO代码和机场名称');
        return;
    }
    
    if (!editIcao && airports.some(a => a.icao === icao)) {
        alert('该ICAO代码已存在');
        return;
    }
    
    const frequencies = [];
    const rows = document.querySelectorAll('.frequency-row');
    
    rows.forEach(row => {
        const frequency = row.querySelector('.freq-value').value.trim();
        if (frequency) {
            frequencies.push({
                type: row.querySelector('.freq-type').value,
                number: row.querySelector('.freq-number').value ? parseInt(row.querySelector('.freq-number').value) : null,
                preRemark: row.querySelector('.freq-pre-remark').value.trim() || null,
                frequency: frequency,
                backup: row.querySelector('.freq-backup').value.trim() || null,
                postRemark: row.querySelector('.freq-post-remark').value.trim() || null
            });
        }
    });
    
    const airportData = { icao, iata, name, nameEn, frequencies };
    
    try {
        const url = editIcao ? `/api/airports/${editIcao}` : '/api/airports';
        const method = editIcao ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(airportData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            closeModal();
            loadAirports();
        } else {
            alert(result.error || '保存失败');
        }
    } catch (error) {
        alert('保存失败，请重试');
    }
}

function deleteAirport(icao, name) {
    deleteIcao = icao;
    document.getElementById('deleteAirportName').textContent = `${name} (${icao})`;
    document.getElementById('deleteModal').classList.add('show');
}

function closeDeleteModal() {
    document.getElementById('deleteModal').classList.remove('show');
    deleteIcao = null;
}

async function confirmDelete() {
    if (!deleteIcao) return;
    
    try {
        const response = await fetch(`/api/airports/${deleteIcao}`, {
            method: 'DELETE'
        });
        
        const result = await response.json();
        
        if (result.success) {
            closeDeleteModal();
            loadAirports();
        } else {
            alert(result.error || '删除失败');
        }
    } catch (error) {
        alert('删除失败，请重试');
    }
}
