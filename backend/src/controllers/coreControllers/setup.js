require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });
const { globSync } = require('glob');
const fs = require('fs');
const { generate: uniqueId } = require('shortid');
const Joi = require('joi');
const mongoose = require('mongoose');

const setup = async (req, res) => {

    try {
        const Admin = mongoose.model('Admin');
        const AdminPassword = mongoose.model('AdminPassword');
        const Setting = mongoose.model('Setting');

        const PaymentMode = mongoose.model('PaymentMode');
        const Taxes = mongoose.model('Taxes');

        const newAdminPassword = new AdminPassword();

        const { name, email, password, language, timezone, country, config = {} } = req.body;

        const objectSchema = Joi.object({
            name: Joi.string().required(),
            email: Joi.string()
                .email({ tlds: { allow: true } })
                .required(),
            password: Joi.string().required(),
        });

        const { error, value } = objectSchema.validate({ name, email, password });
        if (error) {
            return res.status(409).json({
                success: false,
                result: null,
                error: error,
                message: 'Invalid/Missing credentials.',
                errorMessage: error.message,
            });
        }

        const salt = uniqueId();

        const passwordHash = newAdminPassword.generateHash(salt, password);

        const accountOwner = {
            email,
            name,
            role: 'owner',
        };
        const result = await new Admin(accountOwner).save();

        const AdminPasswordData = {
            password: passwordHash,
            emailVerified: true,
            salt: salt,
            user: result._id,
        };
        await new AdminPassword(AdminPasswordData).save();

        const settingData = [];

        const settingsFiles = globSync('./src/setup/defaultSettings/**/*.json');

        for (const filePath of settingsFiles) {
            const file = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

            const settingsToUpdate = {
                crm_erp_tool_app_email: email,
                crm_erp_tool_app_company_email: email,
                crm_erp_tool_app_timezone: timezone,
                crm_erp_tool_app_country: country,
                crm_erp_tool_app_language: language || 'en_us',
            };

            const newSettings = file.map((x) => {
                const settingValue = settingsToUpdate[x.settingKey];
                return settingValue ? { ...x, settingValue } : { ...x };
            });

            settingData.push(...newSettings);
        }

        await Setting.insertMany(settingData);

        await Taxes.insertMany([{ taxName: 'Tax 0%', taxValue: '0', isDefault: true }]);

        await PaymentMode.insertMany([
            {
                name: 'Default Payment',
                description: 'Default Payment Mode (Cash , Wire Transfer)',
                isDefault: true,
            },
        ]);

        return res.status(200).json({
            success: true,
            result: {},
            message: 'Successfully IDURAR App Setup',
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            result: null,
            error: error,
            message: 'An error occurred during setup.',
            errorMessage: error.message,
        });
    }
};

module.exports = setup;
