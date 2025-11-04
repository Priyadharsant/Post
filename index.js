import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';    

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'view'));
app.use(express.static('public'));


let posts = [
    {
        id: 1,
        title: "First sample post",
        content: "This is the first test post. Use it to try edit/delete.",
        author: "Tester",
        date: new Date().toLocaleDateString()
    },
    {
        id: 2,
        title: "Second sample post",
        content: "Second post content goes here.",
        author: "Tester",
        date: new Date().toLocaleDateString()
    },
    {
        id: 3,
        title: "Third sample post",
        content: "Third post for testing delete functionality.",
        author: "Tester",
        date: new Date().toLocaleDateString()
    }
];

app.get('/', (req, res) => {
    res.render('partial/main', { posts: posts });
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});

app.get('/create-post', (req, res) => {
    res.render('partial/create-post');
});


app.post('/create', (req, res) => {
    const { title, content, author } = req.body;
    const newPost = {
        id: posts.length + 1,
        title,
        content,
        author,
        date: new Date().toLocaleDateString()
    };
    posts.push(newPost);
    console.log(newPost);
    console.log("Post created successfully");
    res.redirect('/');
});

app.get("/edit/:id", (req, res) => {
    const postId = parseInt(req.params.id);
    const post = posts.find(p => p.id === postId);
    if (post) {
        res.render("partial/edit-post", { post });
    } else {
        res.status(404).send("Post not found");
    }
});
app.post("/edit/:id", (req, res) => {
    const postId = parseInt(req.params.id);
    const { title, content, author } = req.body;
    const post = posts.find(p => p.id === postId);
    if (post) {
        post.title = title;
        post.content = content;
        post.author = author;
        console.log(post);
        console.log("Post updated successfully");
        res.redirect("/");
    } else {
        res.status(404).send("Post not found");
    }
}); 

app.get("/delete/:id", (req, res) => {
    const postId = parseInt(req.params.id);
    const idx = posts.findIndex(p => p.id === postId);
    if (idx !== -1) {
        posts.splice(idx, 1);
        console.log(`Post with id ${postId} deleted successfully (GET)`);
        return res.redirect("/");
    }
    res.status(404).send("Post not found");
});

app.delete("/delete/:id", (req, res) => {
    const postId = parseInt(req.params.id);
    const originalLength = posts.length;
    posts = posts.filter(p => p.id !== postId);
    if (posts.length < originalLength) {
        console.log(`Post with id ${postId} deleted successfully (DELETE)`);
        return res.json({ success: true });
    }
    res.status(404).json({ success: false, message: 'Post not found' });
});