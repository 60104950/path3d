// pages/api/logScroll.js
export default function handler(req, res) {
    const {  scrollValue, clienty, screeny  } = req.body;
    console.log("Scroll Value from client:", scrollValue);
    console.log("Scroll Value from clienty:", clienty);
    console.log("Scroll Value from screeny:", screeny);
    res.status(200).json({ success: true });
}