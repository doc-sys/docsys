"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _express = _interopRequireDefault(require("express"));

var _expressValidator = require("express-validator");

var _authenticate = _interopRequireWildcard(require("../lib/helpers/authenticate"));

var _document = require("../controller/document.controller");

var _documentCreateNew = _interopRequireDefault(require("../lib/requestSchemas/document.createNew.json"));

var _documentCheckout = _interopRequireDefault(require("../lib/requestSchemas/document.checkout.json"));

var _documentShare = _interopRequireDefault(require("../lib/requestSchemas/document.share.json"));

var _documentFileid = _interopRequireDefault(require("../lib/requestSchemas/document.fileid.json"));

var _validator = require("../lib/helpers/validator");

var multer = require('multer');

var router = _express["default"].Router();

var uploadFileHandler = multer({
  storage: multer.memoryStorage()
});
router.route('/')
/**
 * @api {get} /document/ All documents
 * @apiName documentsGetAll
 * @apiGroup Document
 * @apiDescription Gets all documents on the instance. Can only be accessed by an admin.
 * @apiSuccess {Object[]} document All documents
 * @apiError (401) NotAuthorized Only admins are allow to access this ressource
 * @apiError (500) InternalServerError Something went wron processing your request
 */
.get([_authenticate["default"], _authenticate.requireAdmin, _document.getAllFiles], function (req, res) {
  res.status(200).json({
    docs: res.locals.files
  });
})
/**
* @api {post} /document/ New document
* @apiName documentCreate
* @apiGroup Document
* @apiDescription Creates and uploads a new documents with its body.
* @apiParam {Buffer[]} files Page(s) for the document
* @apiParam {String} title Documents subject or title
* @apiParam {Date} dated Date the original document was recieved
* @apiParam {String} comment Comment to append to log
* @apiSuccess {Object} document The created document
* @apiError (415) {String} FileTypeError Filetype is not supported. So far only PDFs and picture types are supported
* @apiError (500) {String} InternalError Something went wrong
*/
.post([_authenticate["default"], uploadFileHandler.single('documents'), (0, _expressValidator.checkSchema)(_documentCreateNew["default"]), _validator.checkSchemaValidation, _document.createNewFile, _document.uploadFiles], function (req, res) {
  res.status(200).json({
    document: res.locals.file
  });
});
router.route('/own')
/**
 * @api {get} /document/own Own documents
 * @apiName documentGetOwn
 * @apiGroup Document
 * @apiDescription Returns the users documents
 * @apiSuccess {Array} docs User documents basic metadata
 * @apiError (401) {String} PermissionError Not allowed to GET this file
 * @apiError (500) {String} InternalError Something went wrong
 */
.get([_authenticate["default"], _document.getOwnFiles], function (req, res) {
  res.status(200).json({
    docs: res.locals.files
  });
});
router.route('/shared')
/**
 * @api {get} /document/shared Shared documents
 * @apiName documentGetShared
 * @apiGroup Document
 * @apiDescription Returns the documents shared with the user
 * @apiSuccess {Array} sharedDocs Shared documents basic metadata
 * @apiError (401) {String} PermissionError Not allowed to GET this file
 * @apiError (500) {String} InternalError Something went wrong
 */
.get([_authenticate["default"], _document.getSharedFiles], function (req, res) {
  res.status(200).json({
    docs: res.locals.files
  });
});
router.route('/recent')
/**
 * @api {get} /document/recent Get recent activity
 * @apiName documentGetRecent
 * @apiGroup Document
 * @apiDescription Gets the recent activity on the users documents. Query 'limit' limits the amount of returned activity.
 * @apiSuccess {Array} recent Recent actvity
 * @apiError (401) {String} PermissionError Not allowed to GET this
 * @apiError (500) {String} InternalError Something went wrong
 */
.get([_authenticate["default"], _document.getRecent], function (req, res) {
  res.status(200).json(res.locals.recent);
});
router.route('/comment/:fileid')
/**
 * @api {post} /document/comment/:fileid Add comment to file log
 * @apiName documentAddComment
 * @apiGroup Document
 * @apiDescription Returns the file log
 * @apiSuccess {Array} logs Log of the file
 * @apiError (401) {String} PermissionError Not allowed to POST a comment
 * @apiError (500) {String} InternalError Something went wrong
 */
.post([_authenticate["default"], (0, _expressValidator.checkSchema)(_documentFileid["default"]), _validator.checkSchemaValidation, _document.getSingleFile, _document.checkPermissionToFile, _document.appendComment], function (req, res) {
  res.status(200).json(res.locals.file.log);
});
router.route('/checkout/:fileid')
/**
 * @api {get} /document/checkout/:fileid Document checkout
 * @apiName documentCheckout
 * @apiGroup Document
 * @apiDescription Checks out document and sends files as ZIP archive
 * @apiParam {String} fileid The fileid as part of the GET URL
 * @apiSuccess (200) {Stream} ZIP file stream
 * @apiError (401) PermissionError Not allowed to GET this file
 * @apiError (500) {String} InternalError Something went wrong
 */
.get([_authenticate["default"], (0, _expressValidator.checkSchema)(_documentCheckout["default"]), _validator.checkSchemaValidation, _document.getSingleFile, _document.checkPermissionToFile,
/* lockFile ,*/
_document.downloadFile], function (req, res) {
  res.writeHead(200, {
    'Content-Type': res.locals.file.mime,
    'Content-disposition': "attachment; filename=".concat(res.locals.file.title),
    //.${res.locals.file.extension}
    'Content-Length': res.locals.fileBuffer.length
  });
  res.end(res.locals.fileBuffer); // const stream = new Readable()
  // stream._read = () => { }
  // stream.push(res.locals.fileBuffer)
  // stream.push(null)
  // stream.pipe(res)
})
/**
* @api {unlock} /document/checkout/:fileid
* @apiName documentAdminUnlock
* @apiGroup Document
* @apiDescription Unlocks a locked document without actually submitting a new document file. Requires user to be an admin
* @apiParam {String} fileid The fileid as part of the POST URL
* @apiSuccess (200) {Object} The unlocked document
* @apiError (401) PermissionError Not allowed to UNLOCK this file
* @apiError (500) {String} InternalError Something went wrong
*/
.unlock([_authenticate["default"], _authenticate.requireAdmin, (0, _expressValidator.checkSchema)(_documentCheckout["default"]), _validator.checkSchemaValidation, _document.getSingleFile, _document.unlockFile], function (req, res) {
  res.status(200).json({
    doc: res.locals.file
  });
});
router.route('/share/:fileid')
/**
 * @api {post} /document/share/:fileid
 * @apiName documentShareFile
 * @apiGroup Document
 * @apiDescription Shares file with a new user
 * @apiParam {String} fileid The fileid as part of the POST URL
 * @apiParam {String} whoToShare Username to share the file with. Provided in body or query.
 * @apiSuccess (200) {Object} The updated document
 * @apiError (401) PermissionError Not allowed to edit this file
 * @apiError (500) {String} InternalError Something went wrong
 */
.post([_authenticate["default"], (0, _expressValidator.checkSchema)(_documentShare["default"]), _validator.checkSchemaValidation, _document.getSingleFile, _document.checkPermissionToFile, _document.shareFile], function (req, res) {
  res.status(200).json({
    doc: res.locals.file
  });
});
router.route('/archive/:fileid')
/**
 * @api {post} /document/archive/:fileid
 * @apiName documentArchiveFile
 * @apiGroup Document
 * @apiDescription Moves the file to the archive
 * @apiParam {String} fileid The fileid as part of the POST URL
 * @apiSuccess (200) {Object} The archived document
 * @apiError (401) PermissionError Not allowed to archive this file
 * @apiError (500) {String} InternalError Something went wrong
 */
.post([_authenticate["default"], (0, _expressValidator.checkSchema)(_documentFileid["default"]), _validator.checkSchemaValidation, _document.getSingleFile, _document.checkPermissionToFile, _document.archiveFile], function (req, res) {
  res.status(200).json({
    file: res.locals.file
  });
}); // router.route('/queue/:queue/:fileid')
//     .post([authenticate, checkSchema(fileid), checkSchemaValidation, getSingleFile, checkPermissionToFile, downloadFile, handleQueue])

router.route('/:fileid')
/**
 * @api {get} /document/:fileid Get single document
 * @apiName documentGetSingle
 * @apiGroup Document
 * @apiDescription Returns the single requested document
 * @apiParam {String} fileid The fileid as part of the GET URL
 * @apiSuccess {Object} document The requested object
 * @apiError (401) {String} PermissionError Not allowed to GET this file
 * @apiError (500) {String} InternalError Something went wrong
 */
.get([_authenticate["default"], (0, _expressValidator.checkSchema)(_documentFileid["default"]), _validator.checkSchemaValidation, _document.getSingleFile, _document.checkPermissionToFile], function (req, res) {
  res.status(200).json({
    doc: res.locals.file
  });
})
/**
* @api {delete} /document/:fileid Deletes document
* @apiName documentDeleteSingle
* @apiGroup Document
* @apiDescription Deletes the requested document
* @apiParam {String} fileid The fileid as part of the GET URL
* @apiSuccess {Object} document The deleted object
* @apiError (401) {String} PermissionError Not allowed to DELETE this file
* @apiError (500) {String} InternalError Something went wrong
*/
["delete"]([_authenticate["default"], (0, _expressValidator.checkSchema)(_documentFileid["default"]), _validator.checkSchemaValidation, _document.deleteSingleFile], function (req, res) {
  res.status(200).json({
    doc: res.locals.file
  });
});
module.exports = router;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yb3V0ZXMvZG9jdW1lbnQucm91dGUudHMiXSwibmFtZXMiOlsibXVsdGVyIiwicmVxdWlyZSIsInJvdXRlciIsImV4cHJlc3MiLCJSb3V0ZXIiLCJ1cGxvYWRGaWxlSGFuZGxlciIsInN0b3JhZ2UiLCJtZW1vcnlTdG9yYWdlIiwicm91dGUiLCJnZXQiLCJhdXRoZW50aWNhdGUiLCJyZXF1aXJlQWRtaW4iLCJnZXRBbGxGaWxlcyIsInJlcSIsInJlcyIsInN0YXR1cyIsImpzb24iLCJkb2NzIiwibG9jYWxzIiwiZmlsZXMiLCJwb3N0Iiwic2luZ2xlIiwiY3JlYXRlTmV3IiwiY2hlY2tTY2hlbWFWYWxpZGF0aW9uIiwiY3JlYXRlTmV3RmlsZSIsInVwbG9hZEZpbGVzIiwiZG9jdW1lbnQiLCJmaWxlIiwiZ2V0T3duRmlsZXMiLCJnZXRTaGFyZWRGaWxlcyIsImdldFJlY2VudCIsInJlY2VudCIsImZpbGVpZCIsImdldFNpbmdsZUZpbGUiLCJjaGVja1Blcm1pc3Npb25Ub0ZpbGUiLCJhcHBlbmRDb21tZW50IiwibG9nIiwiY2hlY2tvdXQiLCJkb3dubG9hZEZpbGUiLCJ3cml0ZUhlYWQiLCJtaW1lIiwidGl0bGUiLCJmaWxlQnVmZmVyIiwibGVuZ3RoIiwiZW5kIiwidW5sb2NrIiwidW5sb2NrRmlsZSIsImRvYyIsInNoYXJlIiwic2hhcmVGaWxlIiwiYXJjaGl2ZUZpbGUiLCJkZWxldGVTaW5nbGVGaWxlIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7O0FBQ0E7O0FBSUE7O0FBQ0E7O0FBRUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBVkEsSUFBTUEsTUFBTSxHQUFHQyxPQUFPLENBQUMsUUFBRCxDQUF0Qjs7QUFZQSxJQUFJQyxNQUFNLEdBQUdDLG9CQUFRQyxNQUFSLEVBQWI7O0FBQ0EsSUFBSUMsaUJBQWlCLEdBQUdMLE1BQU0sQ0FBQztBQUMzQk0sRUFBQUEsT0FBTyxFQUFFTixNQUFNLENBQUNPLGFBQVA7QUFEa0IsQ0FBRCxDQUE5QjtBQUlBTCxNQUFNLENBQUNNLEtBQVAsQ0FBYSxHQUFiO0FBQ0k7Ozs7Ozs7OztBQURKLENBVUtDLEdBVkwsQ0FVUyxDQUFDQyx3QkFBRCxFQUFlQywwQkFBZixFQUE2QkMscUJBQTdCLENBVlQsRUFVb0QsVUFBQ0MsR0FBRCxFQUFNQyxHQUFOLEVBQWM7QUFDMURBLEVBQUFBLEdBQUcsQ0FBQ0MsTUFBSixDQUFXLEdBQVgsRUFBZ0JDLElBQWhCLENBQXFCO0FBQUVDLElBQUFBLElBQUksRUFBRUgsR0FBRyxDQUFDSSxNQUFKLENBQVdDO0FBQW5CLEdBQXJCO0FBQ0gsQ0FaTDtBQWFJOzs7Ozs7Ozs7Ozs7O0FBYkosQ0EwQktDLElBMUJMLENBMEJVLENBQUNWLHdCQUFELEVBQWVMLGlCQUFpQixDQUFDZ0IsTUFBbEIsQ0FBeUIsV0FBekIsQ0FBZixFQUFzRCxtQ0FBWUMsNkJBQVosQ0FBdEQsRUFBcUZDLGdDQUFyRixFQUE0R0MsdUJBQTVHLEVBQTJIQyxxQkFBM0gsQ0ExQlYsRUEwQm1KLFVBQUNaLEdBQUQsRUFBTUMsR0FBTixFQUFjO0FBQ3pKQSxFQUFBQSxHQUFHLENBQUNDLE1BQUosQ0FBVyxHQUFYLEVBQWdCQyxJQUFoQixDQUFxQjtBQUFFVSxJQUFBQSxRQUFRLEVBQUVaLEdBQUcsQ0FBQ0ksTUFBSixDQUFXUztBQUF2QixHQUFyQjtBQUNILENBNUJMO0FBOEJBekIsTUFBTSxDQUFDTSxLQUFQLENBQWEsTUFBYjtBQUNJOzs7Ozs7Ozs7QUFESixDQVVLQyxHQVZMLENBVVMsQ0FBQ0Msd0JBQUQsRUFBZWtCLHFCQUFmLENBVlQsRUFVc0MsVUFBQ2YsR0FBRCxFQUFNQyxHQUFOLEVBQWM7QUFDNUNBLEVBQUFBLEdBQUcsQ0FBQ0MsTUFBSixDQUFXLEdBQVgsRUFBZ0JDLElBQWhCLENBQXFCO0FBQUVDLElBQUFBLElBQUksRUFBRUgsR0FBRyxDQUFDSSxNQUFKLENBQVdDO0FBQW5CLEdBQXJCO0FBQ0gsQ0FaTDtBQWNBakIsTUFBTSxDQUFDTSxLQUFQLENBQWEsU0FBYjtBQUNJOzs7Ozs7Ozs7QUFESixDQVVLQyxHQVZMLENBVVMsQ0FBQ0Msd0JBQUQsRUFBZW1CLHdCQUFmLENBVlQsRUFVeUMsVUFBQ2hCLEdBQUQsRUFBTUMsR0FBTixFQUFjO0FBQy9DQSxFQUFBQSxHQUFHLENBQUNDLE1BQUosQ0FBVyxHQUFYLEVBQWdCQyxJQUFoQixDQUFxQjtBQUFFQyxJQUFBQSxJQUFJLEVBQUVILEdBQUcsQ0FBQ0ksTUFBSixDQUFXQztBQUFuQixHQUFyQjtBQUNILENBWkw7QUFjQWpCLE1BQU0sQ0FBQ00sS0FBUCxDQUFhLFNBQWI7QUFDSTs7Ozs7Ozs7O0FBREosQ0FVS0MsR0FWTCxDQVVTLENBQUNDLHdCQUFELEVBQWVvQixtQkFBZixDQVZULEVBVW9DLFVBQUNqQixHQUFELEVBQU1DLEdBQU4sRUFBYztBQUMxQ0EsRUFBQUEsR0FBRyxDQUFDQyxNQUFKLENBQVcsR0FBWCxFQUFnQkMsSUFBaEIsQ0FBcUJGLEdBQUcsQ0FBQ0ksTUFBSixDQUFXYSxNQUFoQztBQUNILENBWkw7QUFjQTdCLE1BQU0sQ0FBQ00sS0FBUCxDQUFhLGtCQUFiO0FBQ0k7Ozs7Ozs7OztBQURKLENBVUtZLElBVkwsQ0FVVSxDQUFDVix3QkFBRCxFQUFlLG1DQUFZc0IsMEJBQVosQ0FBZixFQUFvQ1QsZ0NBQXBDLEVBQTJEVSx1QkFBM0QsRUFBMEVDLCtCQUExRSxFQUFpR0MsdUJBQWpHLENBVlYsRUFVMkgsVUFBQ3RCLEdBQUQsRUFBTUMsR0FBTixFQUFjO0FBQ2pJQSxFQUFBQSxHQUFHLENBQUNDLE1BQUosQ0FBVyxHQUFYLEVBQWdCQyxJQUFoQixDQUFxQkYsR0FBRyxDQUFDSSxNQUFKLENBQVdTLElBQVgsQ0FBZ0JTLEdBQXJDO0FBQ0gsQ0FaTDtBQWNBbEMsTUFBTSxDQUFDTSxLQUFQLENBQWEsbUJBQWI7QUFDSTs7Ozs7Ozs7OztBQURKLENBV0tDLEdBWEwsQ0FXUyxDQUFDQyx3QkFBRCxFQUFlLG1DQUFZMkIsNEJBQVosQ0FBZixFQUFzQ2QsZ0NBQXRDLEVBQTZEVSx1QkFBN0QsRUFBNEVDLCtCQUE1RTtBQUFtRztBQUFnQkksc0JBQW5ILENBWFQsRUFXMkksVUFBQ3pCLEdBQUQsRUFBTUMsR0FBTixFQUFjO0FBQ2pKQSxFQUFBQSxHQUFHLENBQUN5QixTQUFKLENBQWMsR0FBZCxFQUFtQjtBQUNmLG9CQUFnQnpCLEdBQUcsQ0FBQ0ksTUFBSixDQUFXUyxJQUFYLENBQWdCYSxJQURqQjtBQUVmLDBEQUErQzFCLEdBQUcsQ0FBQ0ksTUFBSixDQUFXUyxJQUFYLENBQWdCYyxLQUEvRCxDQUZlO0FBRXlEO0FBQ3hFLHNCQUFrQjNCLEdBQUcsQ0FBQ0ksTUFBSixDQUFXd0IsVUFBWCxDQUFzQkM7QUFIekIsR0FBbkI7QUFNQTdCLEVBQUFBLEdBQUcsQ0FBQzhCLEdBQUosQ0FBUTlCLEdBQUcsQ0FBQ0ksTUFBSixDQUFXd0IsVUFBbkIsRUFQaUosQ0FTako7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNILENBMUJMO0FBMkJJOzs7Ozs7Ozs7O0FBM0JKLENBcUNLRyxNQXJDTCxDQXFDWSxDQUFDbkMsd0JBQUQsRUFBZUMsMEJBQWYsRUFBNkIsbUNBQVkwQiw0QkFBWixDQUE3QixFQUFvRGQsZ0NBQXBELEVBQTJFVSx1QkFBM0UsRUFBMEZhLG9CQUExRixDQXJDWixFQXFDbUgsVUFBQ2pDLEdBQUQsRUFBTUMsR0FBTixFQUFjO0FBQ3pIQSxFQUFBQSxHQUFHLENBQUNDLE1BQUosQ0FBVyxHQUFYLEVBQWdCQyxJQUFoQixDQUFxQjtBQUFFK0IsSUFBQUEsR0FBRyxFQUFFakMsR0FBRyxDQUFDSSxNQUFKLENBQVdTO0FBQWxCLEdBQXJCO0FBQ0gsQ0F2Q0w7QUF5Q0F6QixNQUFNLENBQUNNLEtBQVAsQ0FBYSxnQkFBYjtBQUNJOzs7Ozs7Ozs7OztBQURKLENBWUtZLElBWkwsQ0FZVSxDQUFDVix3QkFBRCxFQUFlLG1DQUFZc0MseUJBQVosQ0FBZixFQUFtQ3pCLGdDQUFuQyxFQUEwRFUsdUJBQTFELEVBQXlFQywrQkFBekUsRUFBZ0dlLG1CQUFoRyxDQVpWLEVBWXNILFVBQUNwQyxHQUFELEVBQU1DLEdBQU4sRUFBYztBQUM1SEEsRUFBQUEsR0FBRyxDQUFDQyxNQUFKLENBQVcsR0FBWCxFQUFnQkMsSUFBaEIsQ0FBcUI7QUFBRStCLElBQUFBLEdBQUcsRUFBRWpDLEdBQUcsQ0FBQ0ksTUFBSixDQUFXUztBQUFsQixHQUFyQjtBQUNILENBZEw7QUFnQkF6QixNQUFNLENBQUNNLEtBQVAsQ0FBYSxrQkFBYjtBQUNJOzs7Ozs7Ozs7O0FBREosQ0FXS1ksSUFYTCxDQVdVLENBQUNWLHdCQUFELEVBQWUsbUNBQVlzQiwwQkFBWixDQUFmLEVBQW9DVCxnQ0FBcEMsRUFBMkRVLHVCQUEzRCxFQUEwRUMsK0JBQTFFLEVBQWlHZ0IscUJBQWpHLENBWFYsRUFXeUgsVUFBQ3JDLEdBQUQsRUFBTUMsR0FBTixFQUFjO0FBQy9IQSxFQUFBQSxHQUFHLENBQUNDLE1BQUosQ0FBVyxHQUFYLEVBQWdCQyxJQUFoQixDQUFxQjtBQUFFVyxJQUFBQSxJQUFJLEVBQUViLEdBQUcsQ0FBQ0ksTUFBSixDQUFXUztBQUFuQixHQUFyQjtBQUNILENBYkwsRSxDQWVBO0FBQ0E7O0FBRUF6QixNQUFNLENBQUNNLEtBQVAsQ0FBYSxVQUFiO0FBQ0k7Ozs7Ozs7Ozs7QUFESixDQVdLQyxHQVhMLENBV1MsQ0FBQ0Msd0JBQUQsRUFBZSxtQ0FBWXNCLDBCQUFaLENBQWYsRUFBb0NULGdDQUFwQyxFQUEyRFUsdUJBQTNELEVBQTBFQywrQkFBMUUsQ0FYVCxFQVcyRyxVQUFDckIsR0FBRCxFQUFNQyxHQUFOLEVBQWM7QUFDakhBLEVBQUFBLEdBQUcsQ0FBQ0MsTUFBSixDQUFXLEdBQVgsRUFBZ0JDLElBQWhCLENBQXFCO0FBQUUrQixJQUFBQSxHQUFHLEVBQUVqQyxHQUFHLENBQUNJLE1BQUosQ0FBV1M7QUFBbEIsR0FBckI7QUFDSCxDQWJMO0FBY0k7Ozs7Ozs7Ozs7QUFkSixXQXdCWSxDQUFDakIsd0JBQUQsRUFBZSxtQ0FBWXNCLDBCQUFaLENBQWYsRUFBb0NULGdDQUFwQyxFQUEyRDRCLDBCQUEzRCxDQXhCWixFQXdCMEYsVUFBQ3RDLEdBQUQsRUFBTUMsR0FBTixFQUFjO0FBQ2hHQSxFQUFBQSxHQUFHLENBQUNDLE1BQUosQ0FBVyxHQUFYLEVBQWdCQyxJQUFoQixDQUFxQjtBQUFFK0IsSUFBQUEsR0FBRyxFQUFFakMsR0FBRyxDQUFDSSxNQUFKLENBQVdTO0FBQWxCLEdBQXJCO0FBQ0gsQ0ExQkw7QUE0QkF5QixNQUFNLENBQUNDLE9BQVAsR0FBaUJuRCxNQUFqQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBleHByZXNzLCB7IFJlcXVlc3QsIFJlc3BvbnNlLCBOZXh0RnVuY3Rpb24gfSBmcm9tIFwiZXhwcmVzc1wiXG5pbXBvcnQgeyBjaGVja1NjaGVtYSB9IGZyb20gJ2V4cHJlc3MtdmFsaWRhdG9yJ1xuY29uc3QgbXVsdGVyID0gcmVxdWlyZSgnbXVsdGVyJylcbmltcG9ydCB7IFJlYWRhYmxlIH0gZnJvbSBcInN0cmVhbVwiXG5cbmltcG9ydCBhdXRoZW50aWNhdGUsIHsgcmVxdWlyZUFkbWluIH0gZnJvbSAnLi4vbGliL2hlbHBlcnMvYXV0aGVudGljYXRlJ1xuaW1wb3J0IHsgZ2V0QWxsRmlsZXMsIGNyZWF0ZU5ld0ZpbGUsIGdldFJlY2VudCwgdXBsb2FkRmlsZXMsIGdldE93bkZpbGVzLCBnZXRTaGFyZWRGaWxlcywgY2hlY2tQZXJtaXNzaW9uVG9GaWxlLCBsb2NrRmlsZSwgZ2V0U2luZ2xlRmlsZSwgZG93bmxvYWRGaWxlLCB1bmxvY2tGaWxlLCBzaGFyZUZpbGUsIGNoZWNrRmlsZU93bmVyc2hpcCwgZGVsZXRlU2luZ2xlRmlsZSwgYXBwZW5kQ29tbWVudCwgYXJjaGl2ZUZpbGUgfSBmcm9tICcuLi9jb250cm9sbGVyL2RvY3VtZW50LmNvbnRyb2xsZXInO1xuXG5pbXBvcnQgY3JlYXRlTmV3IGZyb20gJy4uL2xpYi9yZXF1ZXN0U2NoZW1hcy9kb2N1bWVudC5jcmVhdGVOZXcuanNvbidcbmltcG9ydCBjaGVja291dCBmcm9tICcuLi9saWIvcmVxdWVzdFNjaGVtYXMvZG9jdW1lbnQuY2hlY2tvdXQuanNvbidcbmltcG9ydCBzaGFyZSBmcm9tICcuLi9saWIvcmVxdWVzdFNjaGVtYXMvZG9jdW1lbnQuc2hhcmUuanNvbidcbmltcG9ydCBmaWxlaWQgZnJvbSAnLi4vbGliL3JlcXVlc3RTY2hlbWFzL2RvY3VtZW50LmZpbGVpZC5qc29uJ1xuaW1wb3J0IHsgY2hlY2tTY2hlbWFWYWxpZGF0aW9uIH0gZnJvbSAnLi4vbGliL2hlbHBlcnMvdmFsaWRhdG9yJztcblxubGV0IHJvdXRlciA9IGV4cHJlc3MuUm91dGVyKClcbmxldCB1cGxvYWRGaWxlSGFuZGxlciA9IG11bHRlcih7XG4gICAgc3RvcmFnZTogbXVsdGVyLm1lbW9yeVN0b3JhZ2UoKVxufSlcblxucm91dGVyLnJvdXRlKCcvJylcbiAgICAvKipcbiAgICAgKiBAYXBpIHtnZXR9IC9kb2N1bWVudC8gQWxsIGRvY3VtZW50c1xuICAgICAqIEBhcGlOYW1lIGRvY3VtZW50c0dldEFsbFxuICAgICAqIEBhcGlHcm91cCBEb2N1bWVudFxuICAgICAqIEBhcGlEZXNjcmlwdGlvbiBHZXRzIGFsbCBkb2N1bWVudHMgb24gdGhlIGluc3RhbmNlLiBDYW4gb25seSBiZSBhY2Nlc3NlZCBieSBhbiBhZG1pbi5cbiAgICAgKiBAYXBpU3VjY2VzcyB7T2JqZWN0W119IGRvY3VtZW50IEFsbCBkb2N1bWVudHNcbiAgICAgKiBAYXBpRXJyb3IgKDQwMSkgTm90QXV0aG9yaXplZCBPbmx5IGFkbWlucyBhcmUgYWxsb3cgdG8gYWNjZXNzIHRoaXMgcmVzc291cmNlXG4gICAgICogQGFwaUVycm9yICg1MDApIEludGVybmFsU2VydmVyRXJyb3IgU29tZXRoaW5nIHdlbnQgd3JvbiBwcm9jZXNzaW5nIHlvdXIgcmVxdWVzdFxuICAgICAqL1xuICAgIC5nZXQoW2F1dGhlbnRpY2F0ZSwgcmVxdWlyZUFkbWluLCBnZXRBbGxGaWxlc10sIChyZXEsIHJlcykgPT4ge1xuICAgICAgICByZXMuc3RhdHVzKDIwMCkuanNvbih7IGRvY3M6IHJlcy5sb2NhbHMuZmlsZXMgfSlcbiAgICB9KVxuICAgIC8qKlxuICAgICogQGFwaSB7cG9zdH0gL2RvY3VtZW50LyBOZXcgZG9jdW1lbnRcbiAgICAqIEBhcGlOYW1lIGRvY3VtZW50Q3JlYXRlXG4gICAgKiBAYXBpR3JvdXAgRG9jdW1lbnRcbiAgICAqIEBhcGlEZXNjcmlwdGlvbiBDcmVhdGVzIGFuZCB1cGxvYWRzIGEgbmV3IGRvY3VtZW50cyB3aXRoIGl0cyBib2R5LlxuICAgICogQGFwaVBhcmFtIHtCdWZmZXJbXX0gZmlsZXMgUGFnZShzKSBmb3IgdGhlIGRvY3VtZW50XG4gICAgKiBAYXBpUGFyYW0ge1N0cmluZ30gdGl0bGUgRG9jdW1lbnRzIHN1YmplY3Qgb3IgdGl0bGVcbiAgICAqIEBhcGlQYXJhbSB7RGF0ZX0gZGF0ZWQgRGF0ZSB0aGUgb3JpZ2luYWwgZG9jdW1lbnQgd2FzIHJlY2lldmVkXG4gICAgKiBAYXBpUGFyYW0ge1N0cmluZ30gY29tbWVudCBDb21tZW50IHRvIGFwcGVuZCB0byBsb2dcbiAgICAqIEBhcGlTdWNjZXNzIHtPYmplY3R9IGRvY3VtZW50IFRoZSBjcmVhdGVkIGRvY3VtZW50XG4gICAgKiBAYXBpRXJyb3IgKDQxNSkge1N0cmluZ30gRmlsZVR5cGVFcnJvciBGaWxldHlwZSBpcyBub3Qgc3VwcG9ydGVkLiBTbyBmYXIgb25seSBQREZzIGFuZCBwaWN0dXJlIHR5cGVzIGFyZSBzdXBwb3J0ZWRcbiAgICAqIEBhcGlFcnJvciAoNTAwKSB7U3RyaW5nfSBJbnRlcm5hbEVycm9yIFNvbWV0aGluZyB3ZW50IHdyb25nXG4gICAgKi9cbiAgICAucG9zdChbYXV0aGVudGljYXRlLCB1cGxvYWRGaWxlSGFuZGxlci5zaW5nbGUoJ2RvY3VtZW50cycpLCBjaGVja1NjaGVtYShjcmVhdGVOZXcgYXMgYW55KSwgY2hlY2tTY2hlbWFWYWxpZGF0aW9uLCBjcmVhdGVOZXdGaWxlLCB1cGxvYWRGaWxlc10sIChyZXEsIHJlcykgPT4ge1xuICAgICAgICByZXMuc3RhdHVzKDIwMCkuanNvbih7IGRvY3VtZW50OiByZXMubG9jYWxzLmZpbGUgfSlcbiAgICB9KVxuXG5yb3V0ZXIucm91dGUoJy9vd24nKVxuICAgIC8qKlxuICAgICAqIEBhcGkge2dldH0gL2RvY3VtZW50L293biBPd24gZG9jdW1lbnRzXG4gICAgICogQGFwaU5hbWUgZG9jdW1lbnRHZXRPd25cbiAgICAgKiBAYXBpR3JvdXAgRG9jdW1lbnRcbiAgICAgKiBAYXBpRGVzY3JpcHRpb24gUmV0dXJucyB0aGUgdXNlcnMgZG9jdW1lbnRzXG4gICAgICogQGFwaVN1Y2Nlc3Mge0FycmF5fSBkb2NzIFVzZXIgZG9jdW1lbnRzIGJhc2ljIG1ldGFkYXRhXG4gICAgICogQGFwaUVycm9yICg0MDEpIHtTdHJpbmd9IFBlcm1pc3Npb25FcnJvciBOb3QgYWxsb3dlZCB0byBHRVQgdGhpcyBmaWxlXG4gICAgICogQGFwaUVycm9yICg1MDApIHtTdHJpbmd9IEludGVybmFsRXJyb3IgU29tZXRoaW5nIHdlbnQgd3JvbmdcbiAgICAgKi9cbiAgICAuZ2V0KFthdXRoZW50aWNhdGUsIGdldE93bkZpbGVzXSwgKHJlcSwgcmVzKSA9PiB7XG4gICAgICAgIHJlcy5zdGF0dXMoMjAwKS5qc29uKHsgZG9jczogcmVzLmxvY2Fscy5maWxlcyB9KVxuICAgIH0pXG5cbnJvdXRlci5yb3V0ZSgnL3NoYXJlZCcpXG4gICAgLyoqXG4gICAgICogQGFwaSB7Z2V0fSAvZG9jdW1lbnQvc2hhcmVkIFNoYXJlZCBkb2N1bWVudHNcbiAgICAgKiBAYXBpTmFtZSBkb2N1bWVudEdldFNoYXJlZFxuICAgICAqIEBhcGlHcm91cCBEb2N1bWVudFxuICAgICAqIEBhcGlEZXNjcmlwdGlvbiBSZXR1cm5zIHRoZSBkb2N1bWVudHMgc2hhcmVkIHdpdGggdGhlIHVzZXJcbiAgICAgKiBAYXBpU3VjY2VzcyB7QXJyYXl9IHNoYXJlZERvY3MgU2hhcmVkIGRvY3VtZW50cyBiYXNpYyBtZXRhZGF0YVxuICAgICAqIEBhcGlFcnJvciAoNDAxKSB7U3RyaW5nfSBQZXJtaXNzaW9uRXJyb3IgTm90IGFsbG93ZWQgdG8gR0VUIHRoaXMgZmlsZVxuICAgICAqIEBhcGlFcnJvciAoNTAwKSB7U3RyaW5nfSBJbnRlcm5hbEVycm9yIFNvbWV0aGluZyB3ZW50IHdyb25nXG4gICAgICovXG4gICAgLmdldChbYXV0aGVudGljYXRlLCBnZXRTaGFyZWRGaWxlc10sIChyZXEsIHJlcykgPT4ge1xuICAgICAgICByZXMuc3RhdHVzKDIwMCkuanNvbih7IGRvY3M6IHJlcy5sb2NhbHMuZmlsZXMgfSlcbiAgICB9KVxuXG5yb3V0ZXIucm91dGUoJy9yZWNlbnQnKVxuICAgIC8qKlxuICAgICAqIEBhcGkge2dldH0gL2RvY3VtZW50L3JlY2VudCBHZXQgcmVjZW50IGFjdGl2aXR5XG4gICAgICogQGFwaU5hbWUgZG9jdW1lbnRHZXRSZWNlbnRcbiAgICAgKiBAYXBpR3JvdXAgRG9jdW1lbnRcbiAgICAgKiBAYXBpRGVzY3JpcHRpb24gR2V0cyB0aGUgcmVjZW50IGFjdGl2aXR5IG9uIHRoZSB1c2VycyBkb2N1bWVudHMuIFF1ZXJ5ICdsaW1pdCcgbGltaXRzIHRoZSBhbW91bnQgb2YgcmV0dXJuZWQgYWN0aXZpdHkuXG4gICAgICogQGFwaVN1Y2Nlc3Mge0FycmF5fSByZWNlbnQgUmVjZW50IGFjdHZpdHlcbiAgICAgKiBAYXBpRXJyb3IgKDQwMSkge1N0cmluZ30gUGVybWlzc2lvbkVycm9yIE5vdCBhbGxvd2VkIHRvIEdFVCB0aGlzXG4gICAgICogQGFwaUVycm9yICg1MDApIHtTdHJpbmd9IEludGVybmFsRXJyb3IgU29tZXRoaW5nIHdlbnQgd3JvbmdcbiAgICAgKi9cbiAgICAuZ2V0KFthdXRoZW50aWNhdGUsIGdldFJlY2VudF0sIChyZXEsIHJlcykgPT4ge1xuICAgICAgICByZXMuc3RhdHVzKDIwMCkuanNvbihyZXMubG9jYWxzLnJlY2VudClcbiAgICB9KVxuXG5yb3V0ZXIucm91dGUoJy9jb21tZW50LzpmaWxlaWQnKVxuICAgIC8qKlxuICAgICAqIEBhcGkge3Bvc3R9IC9kb2N1bWVudC9jb21tZW50LzpmaWxlaWQgQWRkIGNvbW1lbnQgdG8gZmlsZSBsb2dcbiAgICAgKiBAYXBpTmFtZSBkb2N1bWVudEFkZENvbW1lbnRcbiAgICAgKiBAYXBpR3JvdXAgRG9jdW1lbnRcbiAgICAgKiBAYXBpRGVzY3JpcHRpb24gUmV0dXJucyB0aGUgZmlsZSBsb2dcbiAgICAgKiBAYXBpU3VjY2VzcyB7QXJyYXl9IGxvZ3MgTG9nIG9mIHRoZSBmaWxlXG4gICAgICogQGFwaUVycm9yICg0MDEpIHtTdHJpbmd9IFBlcm1pc3Npb25FcnJvciBOb3QgYWxsb3dlZCB0byBQT1NUIGEgY29tbWVudFxuICAgICAqIEBhcGlFcnJvciAoNTAwKSB7U3RyaW5nfSBJbnRlcm5hbEVycm9yIFNvbWV0aGluZyB3ZW50IHdyb25nXG4gICAgICovXG4gICAgLnBvc3QoW2F1dGhlbnRpY2F0ZSwgY2hlY2tTY2hlbWEoZmlsZWlkKSwgY2hlY2tTY2hlbWFWYWxpZGF0aW9uLCBnZXRTaW5nbGVGaWxlLCBjaGVja1Blcm1pc3Npb25Ub0ZpbGUsIGFwcGVuZENvbW1lbnRdLCAocmVxLCByZXMpID0+IHtcbiAgICAgICAgcmVzLnN0YXR1cygyMDApLmpzb24ocmVzLmxvY2Fscy5maWxlLmxvZylcbiAgICB9KVxuXG5yb3V0ZXIucm91dGUoJy9jaGVja291dC86ZmlsZWlkJylcbiAgICAvKipcbiAgICAgKiBAYXBpIHtnZXR9IC9kb2N1bWVudC9jaGVja291dC86ZmlsZWlkIERvY3VtZW50IGNoZWNrb3V0XG4gICAgICogQGFwaU5hbWUgZG9jdW1lbnRDaGVja291dFxuICAgICAqIEBhcGlHcm91cCBEb2N1bWVudFxuICAgICAqIEBhcGlEZXNjcmlwdGlvbiBDaGVja3Mgb3V0IGRvY3VtZW50IGFuZCBzZW5kcyBmaWxlcyBhcyBaSVAgYXJjaGl2ZVxuICAgICAqIEBhcGlQYXJhbSB7U3RyaW5nfSBmaWxlaWQgVGhlIGZpbGVpZCBhcyBwYXJ0IG9mIHRoZSBHRVQgVVJMXG4gICAgICogQGFwaVN1Y2Nlc3MgKDIwMCkge1N0cmVhbX0gWklQIGZpbGUgc3RyZWFtXG4gICAgICogQGFwaUVycm9yICg0MDEpIFBlcm1pc3Npb25FcnJvciBOb3QgYWxsb3dlZCB0byBHRVQgdGhpcyBmaWxlXG4gICAgICogQGFwaUVycm9yICg1MDApIHtTdHJpbmd9IEludGVybmFsRXJyb3IgU29tZXRoaW5nIHdlbnQgd3JvbmdcbiAgICAgKi9cbiAgICAuZ2V0KFthdXRoZW50aWNhdGUsIGNoZWNrU2NoZW1hKGNoZWNrb3V0KSwgY2hlY2tTY2hlbWFWYWxpZGF0aW9uLCBnZXRTaW5nbGVGaWxlLCBjaGVja1Blcm1pc3Npb25Ub0ZpbGUsIC8qIGxvY2tGaWxlICwqLyBkb3dubG9hZEZpbGVdLCAocmVxLCByZXMpID0+IHtcbiAgICAgICAgcmVzLndyaXRlSGVhZCgyMDAsIHtcbiAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiByZXMubG9jYWxzLmZpbGUubWltZSxcbiAgICAgICAgICAgICdDb250ZW50LWRpc3Bvc2l0aW9uJzogYGF0dGFjaG1lbnQ7IGZpbGVuYW1lPSR7cmVzLmxvY2Fscy5maWxlLnRpdGxlfWAsIC8vLiR7cmVzLmxvY2Fscy5maWxlLmV4dGVuc2lvbn1cbiAgICAgICAgICAgICdDb250ZW50LUxlbmd0aCc6IHJlcy5sb2NhbHMuZmlsZUJ1ZmZlci5sZW5ndGhcbiAgICAgICAgfSlcblxuICAgICAgICByZXMuZW5kKHJlcy5sb2NhbHMuZmlsZUJ1ZmZlcilcblxuICAgICAgICAvLyBjb25zdCBzdHJlYW0gPSBuZXcgUmVhZGFibGUoKVxuICAgICAgICAvLyBzdHJlYW0uX3JlYWQgPSAoKSA9PiB7IH1cbiAgICAgICAgLy8gc3RyZWFtLnB1c2gocmVzLmxvY2Fscy5maWxlQnVmZmVyKVxuICAgICAgICAvLyBzdHJlYW0ucHVzaChudWxsKVxuXG4gICAgICAgIC8vIHN0cmVhbS5waXBlKHJlcylcbiAgICB9KVxuICAgIC8qKlxuICAgICogQGFwaSB7dW5sb2NrfSAvZG9jdW1lbnQvY2hlY2tvdXQvOmZpbGVpZFxuICAgICogQGFwaU5hbWUgZG9jdW1lbnRBZG1pblVubG9ja1xuICAgICogQGFwaUdyb3VwIERvY3VtZW50XG4gICAgKiBAYXBpRGVzY3JpcHRpb24gVW5sb2NrcyBhIGxvY2tlZCBkb2N1bWVudCB3aXRob3V0IGFjdHVhbGx5IHN1Ym1pdHRpbmcgYSBuZXcgZG9jdW1lbnQgZmlsZS4gUmVxdWlyZXMgdXNlciB0byBiZSBhbiBhZG1pblxuICAgICogQGFwaVBhcmFtIHtTdHJpbmd9IGZpbGVpZCBUaGUgZmlsZWlkIGFzIHBhcnQgb2YgdGhlIFBPU1QgVVJMXG4gICAgKiBAYXBpU3VjY2VzcyAoMjAwKSB7T2JqZWN0fSBUaGUgdW5sb2NrZWQgZG9jdW1lbnRcbiAgICAqIEBhcGlFcnJvciAoNDAxKSBQZXJtaXNzaW9uRXJyb3IgTm90IGFsbG93ZWQgdG8gVU5MT0NLIHRoaXMgZmlsZVxuICAgICogQGFwaUVycm9yICg1MDApIHtTdHJpbmd9IEludGVybmFsRXJyb3IgU29tZXRoaW5nIHdlbnQgd3JvbmdcbiAgICAqL1xuICAgIC51bmxvY2soW2F1dGhlbnRpY2F0ZSwgcmVxdWlyZUFkbWluLCBjaGVja1NjaGVtYShjaGVja291dCksIGNoZWNrU2NoZW1hVmFsaWRhdGlvbiwgZ2V0U2luZ2xlRmlsZSwgdW5sb2NrRmlsZV0sIChyZXEsIHJlcykgPT4ge1xuICAgICAgICByZXMuc3RhdHVzKDIwMCkuanNvbih7IGRvYzogcmVzLmxvY2Fscy5maWxlIH0pXG4gICAgfSlcblxucm91dGVyLnJvdXRlKCcvc2hhcmUvOmZpbGVpZCcpXG4gICAgLyoqXG4gICAgICogQGFwaSB7cG9zdH0gL2RvY3VtZW50L3NoYXJlLzpmaWxlaWRcbiAgICAgKiBAYXBpTmFtZSBkb2N1bWVudFNoYXJlRmlsZVxuICAgICAqIEBhcGlHcm91cCBEb2N1bWVudFxuICAgICAqIEBhcGlEZXNjcmlwdGlvbiBTaGFyZXMgZmlsZSB3aXRoIGEgbmV3IHVzZXJcbiAgICAgKiBAYXBpUGFyYW0ge1N0cmluZ30gZmlsZWlkIFRoZSBmaWxlaWQgYXMgcGFydCBvZiB0aGUgUE9TVCBVUkxcbiAgICAgKiBAYXBpUGFyYW0ge1N0cmluZ30gd2hvVG9TaGFyZSBVc2VybmFtZSB0byBzaGFyZSB0aGUgZmlsZSB3aXRoLiBQcm92aWRlZCBpbiBib2R5IG9yIHF1ZXJ5LlxuICAgICAqIEBhcGlTdWNjZXNzICgyMDApIHtPYmplY3R9IFRoZSB1cGRhdGVkIGRvY3VtZW50XG4gICAgICogQGFwaUVycm9yICg0MDEpIFBlcm1pc3Npb25FcnJvciBOb3QgYWxsb3dlZCB0byBlZGl0IHRoaXMgZmlsZVxuICAgICAqIEBhcGlFcnJvciAoNTAwKSB7U3RyaW5nfSBJbnRlcm5hbEVycm9yIFNvbWV0aGluZyB3ZW50IHdyb25nXG4gICAgICovXG4gICAgLnBvc3QoW2F1dGhlbnRpY2F0ZSwgY2hlY2tTY2hlbWEoc2hhcmUpLCBjaGVja1NjaGVtYVZhbGlkYXRpb24sIGdldFNpbmdsZUZpbGUsIGNoZWNrUGVybWlzc2lvblRvRmlsZSwgc2hhcmVGaWxlXSwgKHJlcSwgcmVzKSA9PiB7XG4gICAgICAgIHJlcy5zdGF0dXMoMjAwKS5qc29uKHsgZG9jOiByZXMubG9jYWxzLmZpbGUgfSlcbiAgICB9KVxuXG5yb3V0ZXIucm91dGUoJy9hcmNoaXZlLzpmaWxlaWQnKVxuICAgIC8qKlxuICAgICAqIEBhcGkge3Bvc3R9IC9kb2N1bWVudC9hcmNoaXZlLzpmaWxlaWRcbiAgICAgKiBAYXBpTmFtZSBkb2N1bWVudEFyY2hpdmVGaWxlXG4gICAgICogQGFwaUdyb3VwIERvY3VtZW50XG4gICAgICogQGFwaURlc2NyaXB0aW9uIE1vdmVzIHRoZSBmaWxlIHRvIHRoZSBhcmNoaXZlXG4gICAgICogQGFwaVBhcmFtIHtTdHJpbmd9IGZpbGVpZCBUaGUgZmlsZWlkIGFzIHBhcnQgb2YgdGhlIFBPU1QgVVJMXG4gICAgICogQGFwaVN1Y2Nlc3MgKDIwMCkge09iamVjdH0gVGhlIGFyY2hpdmVkIGRvY3VtZW50XG4gICAgICogQGFwaUVycm9yICg0MDEpIFBlcm1pc3Npb25FcnJvciBOb3QgYWxsb3dlZCB0byBhcmNoaXZlIHRoaXMgZmlsZVxuICAgICAqIEBhcGlFcnJvciAoNTAwKSB7U3RyaW5nfSBJbnRlcm5hbEVycm9yIFNvbWV0aGluZyB3ZW50IHdyb25nXG4gICAgICovXG4gICAgLnBvc3QoW2F1dGhlbnRpY2F0ZSwgY2hlY2tTY2hlbWEoZmlsZWlkKSwgY2hlY2tTY2hlbWFWYWxpZGF0aW9uLCBnZXRTaW5nbGVGaWxlLCBjaGVja1Blcm1pc3Npb25Ub0ZpbGUsIGFyY2hpdmVGaWxlXSwgKHJlcSwgcmVzKSA9PiB7XG4gICAgICAgIHJlcy5zdGF0dXMoMjAwKS5qc29uKHsgZmlsZTogcmVzLmxvY2Fscy5maWxlIH0pXG4gICAgfSlcblxuLy8gcm91dGVyLnJvdXRlKCcvcXVldWUvOnF1ZXVlLzpmaWxlaWQnKVxuLy8gICAgIC5wb3N0KFthdXRoZW50aWNhdGUsIGNoZWNrU2NoZW1hKGZpbGVpZCksIGNoZWNrU2NoZW1hVmFsaWRhdGlvbiwgZ2V0U2luZ2xlRmlsZSwgY2hlY2tQZXJtaXNzaW9uVG9GaWxlLCBkb3dubG9hZEZpbGUsIGhhbmRsZVF1ZXVlXSlcblxucm91dGVyLnJvdXRlKCcvOmZpbGVpZCcpXG4gICAgLyoqXG4gICAgICogQGFwaSB7Z2V0fSAvZG9jdW1lbnQvOmZpbGVpZCBHZXQgc2luZ2xlIGRvY3VtZW50XG4gICAgICogQGFwaU5hbWUgZG9jdW1lbnRHZXRTaW5nbGVcbiAgICAgKiBAYXBpR3JvdXAgRG9jdW1lbnRcbiAgICAgKiBAYXBpRGVzY3JpcHRpb24gUmV0dXJucyB0aGUgc2luZ2xlIHJlcXVlc3RlZCBkb2N1bWVudFxuICAgICAqIEBhcGlQYXJhbSB7U3RyaW5nfSBmaWxlaWQgVGhlIGZpbGVpZCBhcyBwYXJ0IG9mIHRoZSBHRVQgVVJMXG4gICAgICogQGFwaVN1Y2Nlc3Mge09iamVjdH0gZG9jdW1lbnQgVGhlIHJlcXVlc3RlZCBvYmplY3RcbiAgICAgKiBAYXBpRXJyb3IgKDQwMSkge1N0cmluZ30gUGVybWlzc2lvbkVycm9yIE5vdCBhbGxvd2VkIHRvIEdFVCB0aGlzIGZpbGVcbiAgICAgKiBAYXBpRXJyb3IgKDUwMCkge1N0cmluZ30gSW50ZXJuYWxFcnJvciBTb21ldGhpbmcgd2VudCB3cm9uZ1xuICAgICAqL1xuICAgIC5nZXQoW2F1dGhlbnRpY2F0ZSwgY2hlY2tTY2hlbWEoZmlsZWlkKSwgY2hlY2tTY2hlbWFWYWxpZGF0aW9uLCBnZXRTaW5nbGVGaWxlLCBjaGVja1Blcm1pc3Npb25Ub0ZpbGVdLCAocmVxLCByZXMpID0+IHtcbiAgICAgICAgcmVzLnN0YXR1cygyMDApLmpzb24oeyBkb2M6IHJlcy5sb2NhbHMuZmlsZSB9KVxuICAgIH0pXG4gICAgLyoqXG4gICAgKiBAYXBpIHtkZWxldGV9IC9kb2N1bWVudC86ZmlsZWlkIERlbGV0ZXMgZG9jdW1lbnRcbiAgICAqIEBhcGlOYW1lIGRvY3VtZW50RGVsZXRlU2luZ2xlXG4gICAgKiBAYXBpR3JvdXAgRG9jdW1lbnRcbiAgICAqIEBhcGlEZXNjcmlwdGlvbiBEZWxldGVzIHRoZSByZXF1ZXN0ZWQgZG9jdW1lbnRcbiAgICAqIEBhcGlQYXJhbSB7U3RyaW5nfSBmaWxlaWQgVGhlIGZpbGVpZCBhcyBwYXJ0IG9mIHRoZSBHRVQgVVJMXG4gICAgKiBAYXBpU3VjY2VzcyB7T2JqZWN0fSBkb2N1bWVudCBUaGUgZGVsZXRlZCBvYmplY3RcbiAgICAqIEBhcGlFcnJvciAoNDAxKSB7U3RyaW5nfSBQZXJtaXNzaW9uRXJyb3IgTm90IGFsbG93ZWQgdG8gREVMRVRFIHRoaXMgZmlsZVxuICAgICogQGFwaUVycm9yICg1MDApIHtTdHJpbmd9IEludGVybmFsRXJyb3IgU29tZXRoaW5nIHdlbnQgd3JvbmdcbiAgICAqL1xuICAgIC5kZWxldGUoW2F1dGhlbnRpY2F0ZSwgY2hlY2tTY2hlbWEoZmlsZWlkKSwgY2hlY2tTY2hlbWFWYWxpZGF0aW9uLCBkZWxldGVTaW5nbGVGaWxlXSwgKHJlcSwgcmVzKSA9PiB7XG4gICAgICAgIHJlcy5zdGF0dXMoMjAwKS5qc29uKHsgZG9jOiByZXMubG9jYWxzLmZpbGUgfSlcbiAgICB9KVxuXG5tb2R1bGUuZXhwb3J0cyA9IHJvdXRlciJdfQ==