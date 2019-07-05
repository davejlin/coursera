const fs = {
    createReadStream: jest.fn().mockReturnValue(
        { 
            on: jest.fn().mockImplementation((_, cb) => {cb()}),
            close: jest.fn() 
        } 
    ),
    createWriteStream: jest.fn().mockReturnValue(
        {
            on: jest.fn().mockImplementation((_, cb) => {cb()}), 
            write: jest.fn(),
            close: jest.fn()
        }
    ),
    existsSync: jest.fn().mockReturnValue(true),
    unlinkSync: jest.fn()
}

module.exports = fs;