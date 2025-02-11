const CryptoJS = require('crypto-js');

function encrypt(text, key) {
    return CryptoJS.AES.encrypt(text, key).toString();
}

// 使用示例  TODO 加密博客内容 前端解密
const content = "这是需要加密的内容";
const key = "your-secret-key";
const encrypted = encrypt(content, key);
console.log('加密后的内容:', encrypted); 