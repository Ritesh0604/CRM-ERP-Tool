const express = require("express");
const router = express.Router();
const path = require("node:path");

// Middleware for error handling
router.use((error, req, res, next) => {
	console.error(error.stack);
	res.status(500).json({
		success: false,
		result: null,
		message: "Internal Server Error",
		error: error.message,
	});
});

router.route("/:subPath/:directory/:file").get((req, res, next) => {
	const { subPath, directory, file } = req.params;

	const options = {
		root: path.join(__dirname, `../../public/${subPath}/${directory}`),
	};
	const fileName = file;

	// Send file to the client
	res.sendFile(fileName, options, (error) => {
		if (error) {
			// If error occurs while sending file, pass it to the error handling middleware
			next(error);
		}
	});
});

// router.route('/:subPath/:directory/:file').get(function (req, res) {
//     try {
//         const { subPath, directory, file } = req.params;

//         const options = {
//             root: path.join(__dirname, `../../public/${subPath}/${directory}`),
//         };
//         const fileName = file;
//         return res.sendFile(fileName, options, function (error) {
//             if (error) {
//                 return res.status(404).json({
//                     success: false,
//                     result: null,
//                     message: 'we could not find : ' + file,
//                 });
//             }
//         });
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
