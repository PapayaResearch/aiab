const api = async (req, res) => {
    const { uri } = req.query;
    const data = await fetch(uri).then((res) => res.arrayBuffer());

    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).send(Buffer.from(data));
};

export default api;