// pages/api/logScroll.js
export default function handler(req, res) {
    const {  statistics, currentDistance,distance } = req.body;
    console.log("Scroll Value from client:", statistics);
    //console.log("Scroll Value from touch1:", currentDistance);
    //console.log("Scroll Value from touch2:", distance);
    res.status(200).json({ success: true });
}