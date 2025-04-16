// Example blog post structure
const blogPosts = [
    {
        id: 1,
        title: "First Blog Post",
        excerpt: "This is a short excerpt from the first blog post...",
        date: "2024-01-01",
        content: "Full blog post content goes here...",
        image: "path/to/image.jpg",
        tags: ["tech", "programming"]
    }
    // Add more posts here
];

// Function to load blog posts
function loadBlogPosts() {
    const blogGrid = document.querySelector('.blog-grid');
    if (!blogGrid) return;

    blogPosts.forEach(post => {
        const postElement = createPostElement(post);
        blogGrid.appendChild(postElement);
    });
}

// Create HTML element for a blog post
function createPostElement(post) {
    const article = document.createElement('article');
    article.className = 'blog-post';
    article.innerHTML = `
        <div class="post-image">
            <img src="${post.image}" alt="${post.title}">
        </div>
        <div class="post-content">
            <h3>${post.title}</h3>
            <div class="post-meta">
                <span class="date">${post.date}</span>
                <span class="tags">${post.tags.join(', ')}</span>
            </div>
            <p>${post.excerpt}</p>
            <a href="/blog/${post.id}" class="read-more">Read More</a>
        </div>
    `;
    return article;
}

// Load posts when DOM is ready
document.addEventListener('DOMContentLoaded', loadBlogPosts); 