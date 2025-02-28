const http = require('http');
const url = require('url');

const API_KEY = 'c51e7930-ae4b-4afe-9f6f-16390ee7f280';
const API_URL = 'https://ark.cn-beijing.volces.com/api/v3/chat/completions';

const server = http.createServer(async (req, res) => {
    // 设置CORS头
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // 处理预检请求
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // 只处理/generate路径的POST请求
    if (req.method === 'POST' && req.url === '/generate') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            try {
                const { idea } = JSON.parse(body);
                
                // 准备API请求数据
                const apiRequestData = {
                    model: 'deepseek-r1-250120',
                    messages: [
                        {
                            role: 'system',
                            content: `你是一个创意变现专家，擅长将用户的想法转化为即时可执行的赚钱方案。你的方案具有以下特点：

1. 即时性：用户可以立刻开始执行
2. 可行性：充分考虑现实条件和资源
3. 具体性：提供详细的时间安排和行动步骤
4. 收益性：明确预期收入和变现途径
5. 激励性：通过朗朗上口的口号提升动力

请按照以下模板输出：

# 💫 [主题]一日变现方案

**今日口号**：[朗朗上口的激励口号]

## 一、具体行动安排
| 时间 | 行动步骤 | 预期收益 |
|------|----------|----------|
| 09:00 | [具体行动] | ¥xx |
| 11:00 | [具体行动] | ¥xx |
| 14:00 | [具体行动] | ¥xx |
| 16:00 | [具体行动] | ¥xx |

## 二、必备物品清单
- [必备物品1]（预算¥xx）
- [必备物品2]（预算¥xx）

## 三、变现技巧
1. [具体技巧1]
2. [具体技巧2]
3. [具体技巧3]

## 四、温馨提示
- ⚠️ [重要提示1]
- 💡 [实用建议1]
- 🔔 [注意事项1]

## 五、今日目标
- 最低目标：¥xxx
- 理想收入：¥xxx

**加油口号**：
✨ [激励性口号]

祝你成功！💪`
                        },
                        {
                            role: 'user',
                            content: idea
                        }
                    ]
                };

                // 调用API
                const apiResponse = await fetch(API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${API_KEY}`
                    },
                    body: JSON.stringify(apiRequestData)
                });

                if (!apiResponse.ok) {
                    throw new Error('API请求失败');
                }

                const data = await apiResponse.json();
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    content: data.choices[0].message.content
                }));

            } catch (error) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: error.message }));
            }
        });
    } else {
        res.writeHead(404);
        res.end();
    }
});

// 设置60秒超时
server.timeout = 60000;

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
});