export default function sendResponse(res, data, error, msg) {
    res.json({
    error,
    msg,
    data: data,
    });
  }