const { format } = require('date-fns');
const { v4: uuid } = require('uuid');

const fs = require('node:fs');
const fsPromises = require('node:fs').promises;
const path = require('path');

const logEvents = async (msg, logName) => {
    const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`;
    const logItem = `${dateTime}\t ${uuid()}\t${msg}\n`;
    console.log(logItem);
    try {
        if (!fs.existsSync(path.join(__dirname, 'logs'))) {
            await fsPromises.mkdir(path.join(__dirname, 'logs'));
        }
        
        await fsPromises.appendFile(path.join(__dirname, 'logs', logName), logItem);
    }
    catch (err) {
        console.log(err);
    }
}


module.exports = logEvents;