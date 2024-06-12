const express = require('express');
const router = express.Router();
const downloadPdf = require('@/handlers/downloadHandler/downloadPdf');
const { catchErrors } = require('@/handlers/errorHandlers');

router.get('/:directory/:file', catchErrors(async function (req, res) {
    const { directory, file } = req.params;
    const id = file.slice(directory.length + 1).slice(0, -4); // extract id from file name
    await downloadPdf(req, res, { directory, id });
}));

// router.route('/:directory/:file').get(function (req, res) {
//     try {
//         const { directory, file } = req.params;
//         const id = file.slice(directory.length + 1).slice(0, -4); // extract id from file name
//         downloadPdf(req, res, { directory, id });
//     } catch (error) {
//         return res.status(503).json({
//             success: false,
//             result: null,
//             message: error.message,
//             error: error,
//         });
//     }
// });

module.exports = router;
