import fs from "fs";
import imagekit from "../configs/imageKit.js";
import Post from "../Models/Post.js";
import User from "../Models/User.js";
// add post 
export const addPost = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { content, post_type } = req.body;
        const images=req.files
        let image_urls=[]
        if(images.length){
            image_urls=await Promise.all(images.map(async (image) => {
                const fileBuffer=fs.readFileSync(image.path)
                 const response = await imagekit.upload({
                        file: fileBuffer,
                        fileName: image.originalname,
                        folder:"posts",
                      });
                      const url = imagekit.url({
                        path: response.filePath,
                        transformation: [
                          { quality: "auto" },
                          { format: "webp" },
                          { width: "1280" },
                        ],
                      });
                      return url;
            }))
        }
        await Post.create({
            user:userId,
            content,
            post_type,
            image_urls
        })
        res.json({ success: true, message: "post created successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}


/// get post 
export const getFeedPosts = async (req, res) => {
try {
    const {userId}= req.auth();
    const user=await User.findById(userId)
    const userIds=[userId,...user.connections, ...user.following]
    const posts= await Post.find({user:{$in:userIds}}).populate('user').sort({createdAt:-1})

    res.json({success:true, posts})
} catch (error) {
    console.log(error);
        res.json({ success: false, message: error.message });
}
}


// like post
export const likePost = async (req, res) => {
try {
        const {userId}= req.auth();
        const {postId}=req.body
        const post=await Post.findById(postId)
        if(post.like_count.includes(userId)){
            post.like_count=post.like_count.filter(user=>user!==userId)
            await post.save()
             res.json({success:true, message:"post unliked successfully"})
        }
        else{
            post.like_count.push(userId)
            await post.save()
            res.json({success:true, message:"post liked successfully"})
        }
    
} catch (error) {
    console.log(error);
        res.json({ success: false, message: error.message });
}
}
