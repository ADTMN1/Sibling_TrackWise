const Subject = require("../models/subjectModel");

exports.createSubject = async (data) => {
  const subject = new Subject(data);
  return await subject.save();
};

exports.getAllSubjects = async () => {
  return await Subject.find();
};

exports.getSubjectById = async (id) => {
  return await Subject.findById(id);
};

exports.updateSubject = async (id, data) => {
  return await Subject.findByIdAndUpdate(id, data, { new: true });
};

exports.deleteSubject = async (id) => {
  const result = await Subject.findByIdAndDelete(id);
  return result !== null;
};
