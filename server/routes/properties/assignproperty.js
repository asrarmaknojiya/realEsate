const express = require("express");
const router = express.Router();
const assigned = require("../../controller/properties/assignproperty");

// ✅ Get all assignments
router.get("/getassignedproperties", assigned.getAssignedProperties);

// ✅ Get assignment by id
router.get("/getassignedproperties/:id", assigned.getAssignedPropertyById);

// ✅ Add assignment
router.post("/addassignedproperty", assigned.addAssignedProperty);

// ✅ Update assignment
router.put("/updateassignedproperty/:id", assigned.updateAssignedProperty);

// ✅ Delete assignment
router.delete("/deleteassignedproperty/:id", assigned.deleteAssignedProperty);

module.exports = router;
