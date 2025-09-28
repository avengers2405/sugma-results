import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 6000;

app.use(cors());
app.use(express.json());

// Configure multer to store file in memory
const upload = multer({ storage: multer.memoryStorage() });

// Store parsed messages globally (in production, use a database)
let parsedMessages = [];

app.post('/upload/chat', upload.single('file'), (req, res) => {
    try {
        console.log('reaching the upload endpoint');
        
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Extract text from uploaded file buffer
        const fileContent = req.file.buffer.toString('utf-8');
        console.log('File content extracted, length:', fileContent.length);

        // Create regex pattern to match date-time format like "7/19/25, 5:39 PM -"
        // Pattern breakdown:
        // \d{1,2}\/\d{1,2}\/\d{2} - matches date like 7/19/25 or 12/31/24
        // ,\s - matches comma and space
        // \d{1,2}:\d{2}\s - matches time like 5:39 or 12:45 followed by space
        // (AM|PM)\s- - matches AM or PM followed by space and dash
        const dateTimePattern = /\d{1,2}\/\d{1,2}\/\d{2},\s\d{1,2}:\d{2}\s(AM|PM)\s-/g;

        // Split the text using the regex pattern
        const messages = [];
        let lastIndex = 0;
        let match;

        // Find all matches and split the text
        while ((match = dateTimePattern.exec(fileContent)) !== null) {
            const messageText = fileContent.substring(lastIndex, match.index).trim();
            if (messageText) {
                messages.push(messageText);
            }
            
            // Update lastIndex to start of current match
            lastIndex = match.index;
        }

        // Add the last message (from last match to end of file)
        const lastMessage = fileContent.substring(lastIndex).trim();
        if (lastMessage) {
            messages.push(lastMessage);
        }

        // Store parsed messages
        parsedMessages = messages;

        console.log(`Parsed ${messages.length} messages from the chat file`);
        
        // Print each message separated by 2 new lines
        messages.forEach((message, index) => {
            console.log(`Message ${index + 1}:\n${message}\n\n`);
        });
        
        res.json({ 
            success: true,
            message: 'File processed successfully',
            messagesCount: messages.length
        });

    } catch (error) {
        console.error('Error processing file:', error);
        res.status(500).json({ error: 'Failed to process uploaded file' });
    }
});

app.listen(PORT, ()=>{
    console.log(`happi server at ${PORT}`);
})