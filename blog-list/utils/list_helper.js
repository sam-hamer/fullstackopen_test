const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  const initialValue = 0;
  const sum = blogs.reduce((acc, blog) => acc + blog.likes, initialValue);
  return sum;
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return {};
  }
  let favorite = blogs[0];

  for (let i = 1; i < blogs.length; i++) {
    if (blogs[i].likes > favorite.likes) {
      favorite = blogs[i];
    }
  }
  return favorite;
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
};
