const read = async (Model, req, res) => {
    const result = await Model.findOne({
        _id: req.params.id,
        removed: false,
    })
        .populate('company', 'name')
        .exec();

    if (!result) {
        return res.status(404).json({
            success: false,
            result: null,
            message: 'No document found ',
        });
    } else {
        return res.status(200).json({
            success: true,
            result,
            message: 'We found this document ',
        });
    }
};

module.exports = read;
