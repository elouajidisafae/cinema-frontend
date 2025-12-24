export const getImageUrl = (path) => {
    if (!path) return "https://via.placeholder.com/300x450?text=No+Image";
    if (path.startsWith("http")) return path;
    return `http://localhost:8080${path}`;
};
