/**
 * ShiftsController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const API_ERRORS = require('../constants/APIErrors');

const _ = require('@sailshq/lodash');
module.exports = {
  
    create: function (req,res) {
        if(!req.body) {
            return res.badRequest(Utils.jsonErr('Empty body'));
        }

        const name = req.body.name;
        const date = req.body.date;
        const startTime = req.body.startTime;
        const endTime = req.body.endTime;

        if(!name) {
            return res.badRequest(Utils.jsonErr('name is required'));
        }
        if(!date) {
            return res.badRequest(Utils.jsonErr('date is required'));
        }
        if(!startTime) {
            return res.badRequest(Utils.jsonErr('startTime is required'));
        }
        if(!endTime) {
            return res.badRequest(Utils.jsonErr('endTime is required'));
        }

        ShiftsManager
            .createShift(req.body)
            .then(data => {
                res.created(data)
            })
            .catch(err => {
				/* istanbul ignore next */
				return res.serverError(Utils.jsonErr(err));
			});
    },
    update: function (req, res) {
		if(!req.body) {
			return res.badRequest(Utils.jsonErr('Empty body'));
		}
        if(!req.body.id) {
            return res.badRequest(Utils.jsonErr('Please input id'));
        }

		ShiftsManager
			.updateShift(req.body)
			.then(resp => {
				res.ok(resp);
			})
			.catch(err => {
				/* istanbul ignore next */
				return res.serverError(Utils.jsonErr(err));
			});
	},
    shifts: function (req, res) {
		ShiftsManager
			.getShifts()
			.then(resp => {
				res.ok(resp);
			})
			.catch(err => {
				/* istanbul ignore next */
				return res.serverError(Utils.jsonErr(err));
			});
	},
    delete: function (req, res) {
		if(!req.body) {
			return res.badRequest(Utils.jsonErr('Empty body'));
		}

		if(!req.body.id) {
            return res.badRequest(Utils.jsonErr('Please input id'));
        }

		ShiftsManager
			.deleteShift(req.body)
			.then(deleted => {
				res.ok(deleted);
			})
			.catch(err => {
				/* istanbul ignore next */
				return res.serverError(Utils.jsonErr(err));
			});
	},
};

