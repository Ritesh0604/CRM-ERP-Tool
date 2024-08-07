exports.migrate = (result) => {
    const lead = result.type === 'people' ? result.people : result.company;
    const newData = {};
    newData._id = result._id;
    newData.type = result.type;
    newData.status = result.status;
    newData.source = result.source;
    newData.name = result.name;
    newData.phone = lead.phone;
    newData.email = lead.email;
    newData.website = lead.website;
    newData.country = lead.country;
    newData.address = lead.address;
    newData.people = result.people;
    newData.company = result.company;
    newData.notes = result.notes;
    return newData;
};
