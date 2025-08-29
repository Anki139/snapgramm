import fs from 'fs';
import imagekit from '../configs/imageKit.js';
import Message from '../Models/Message.js';
const connections={}
 
export const sseController=(req , res)=>{
const {userId}  = req.params
console.log('sse connection established for user:', userId)
// set headers for SSE
res.setHeader('Content-Type', 'text/event-stream');
res.setHeader('Cache-Control', 'no-cache'); 
res.setHeader('Connection', 'keep-alive');
res.setHeader('Access-Control-Allow-Origin', '*');

// add the client response to the connections object
connections[userId] = res;
// send a initial message to the client
res.write('log: connected to the sse stream\n\n');
// handle client disconnect
req.on('close',()=>{
//remove the client response from the connections object
delete connections[userId];
console.log('client disconnected')
})

}

export const sendMessage=async (req, res) => {
    try{
const { userId } = req.auth();
const { to_user_id , text } = req.body;
const image=req.file;
let media_url='';
let message_type=image? 'image':'text';
if(message_type==='image'){
const fileBuffer=fs.readFileSync(image.path);
const response= await imagekit.upload({
    file:fileBuffer,
    fileName:image.originalname,
})
media_url=imagekit.url({
    path:response.filePath,
    transformation:[
        { quality: 'auto' },
        { format: 'webp' },
        { width: '1280' },
    ],
});
}
const message=await Message.create({
    from_user_id: userId,
    to_user_id,
    text,
    message_type,
    media_url,
})
res.json({ success: true, message });


// send message to userid using SSE
const messageWithUserData=await Message.findById(message._id).populate('from_user_id');
if(connections[to_user_id]){
    connections[to_user_id].write(`data: ${JSON.stringify(messageWithUserData)}\n\n`);
}
}catch(error){
console.log('Error sending message:', error);
res.json({ success: false, error: 'Failed to send message' });
} 

}

//get chat messages
export const getChatMessages = async (req, res) => {
try {
    const { userId } = req.auth();
    const { to_user_id } = req.body;

    const messages= await Message.find({
        $or:[
            { from_user_id: userId, to_user_id },
            { from_user_id: to_user_id, to_user_id: userId }
        ]
    }).sort({ createdAt: -1 })

    // mark messages as read
    await Message.updateMany(
        { from_user_id: to_user_id, to_user_id: userId,  },{seen:true}
    )
    res.json({ success: true, messages });
} catch (error) {
    console.log('Error sending message:', error);
res.json({ success: false, error: 'Failed to send message' });
}
}


// get recent messages

export const getRecentMessages = async (req, res) => {
try {
    const { userId } = req.auth();
    const messages=await Message.find({
       to_user_id: userId
    }).populate('from_user_id to_user_id').sort({createdAt:-1})

    res.json({ success: true, messages });
} catch (error) {
    res.json({ success: false, error: 'Failed to get recent messages' });
}
}