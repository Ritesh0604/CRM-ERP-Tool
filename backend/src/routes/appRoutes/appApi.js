const express = require('express');
const { catchErrors } = require('@/handlers/errorHandlers');
const router = express.Router();

const appControllers = require('@/controllers/appControllers');
const { routeList } = require('@/models/utils');

// Define route handlers for each entity
const routeApp = (entity, controller) => {
    const { create, read, update, delete: deleteFn, search, list, listAll, filter, summary, mail, convert } = controller;

    router.post(`/${entity}/create`, catchErrors(create));
    router.get(`/${entity}/read/:id`, catchErrors(read));
    router.patch(`/${entity}/update/:id`, catchErrors(update));
    router.delete(`/${entity}/delete/:id`, catchErrors(deleteFn));
    router.get(`/${entity}/search`, catchErrors(search));
    router.get(`/${entity}/list`, catchErrors(list));
    router.get(`/${entity}/listAll`, catchErrors(listAll));
    router.get(`/${entity}/filter`, catchErrors(filter));
    router.get(`/${entity}/summary`, catchErrors(summary));

    // Additional routes based on entity type
    if (entity === 'invoice' || entity === 'quote' || entity === 'offer' || entity === 'payment') {
        router.post(`/${entity}/mail`, catchErrors(mail));
    }

    if (entity === 'quote') {
        router.get(`/${entity}/convert/:id`, catchErrors(convert));
    }
};
// const routeApp = (entity, controller) => {
//     router.route(`/${entity}/create`).post(catchErrors(controller['create']));
//     router.route(`/${entity}/read/:id`).get(catchErrors(controller['read']));
//     router.route(`/${entity}/update/:id`).patch(catchErrors(controller['update']));
//     router.route(`/${entity}/delete/:id`).delete(catchErrors(controller['delete']));
//     router.route(`/${entity}/search`).get(catchErrors(controller['search']));
//     router.route(`/${entity}/list`).get(catchErrors(controller['list']));
//     router.route(`/${entity}/listAll`).get(catchErrors(controller['listAll']));
//     router.route(`/${entity}/filter`).get(catchErrors(controller['filter']));
//     router.route(`/${entity}/summary`).get(catchErrors(controller['summary']));

//     if (entity === 'invoice' || entity === 'quote' || entity === 'offer' || entity === 'payment') {
//         router.route(`/${entity}/mail`).post(catchErrors(controller['mail']));
//     }

//     if (entity === 'quote') {
//         router.route(`/${entity}/convert/:id`).get(catchErrors(controller['convert']));
//     }
// };

// Iterate through routeList and set up routes for each entity
routeList.forEach((entity, controllerName) => {
    const controller = appControllers[controllerName];

    // Check if controller exists before setting up routes
    if (controller) {
        routeApp(entity, controller);
    } else {
        console.error(`Controller for entity '${entity}' not found.`);
    }
});

module.exports = router;
