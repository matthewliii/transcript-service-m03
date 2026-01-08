import { beforeEach, describe, expect, it } from 'vitest';
import { TranscriptDB, type TranscriptService } from './transcript.service.ts';

let db: TranscriptService;
beforeEach(() => {
  db = new TranscriptDB();
});

describe('addStudent', () => {
  it('should add a student to the database and return their id', () => {
    expect(db.nameToIDs('blair')).toStrictEqual([]);
    const id1 = db.addStudent('blair');
    expect(db.nameToIDs('blair')).toStrictEqual([id1]);
  });

  it('should return an ID distinct from any ID in the database', () => {
    // we'll add 3 students and check to see that their IDs are all different.
    const id1 = db.addStudent('blair');
    const id2 = db.addStudent('corey');
    const id3 = db.addStudent('del');
    expect(id1).not.toEqual(id2);
    expect(id1).not.toEqual(id3);
    expect(id2).not.toEqual(id3);
  });

  it('should permit adding a student w/ same name as an existing student', () => {
    const id1 = db.addStudent('blair');
    const id2 = db.addStudent('blair');
    expect(id1).not.toEqual(id2);
  });
});

describe('getTranscript', () => {
  it('given the ID of a student, should return the student’s transcript', () => {
    const id1 = db.addStudent('blair');
    expect(db.getTranscript(id1)).not.toBeNull();
  });

  it('given the ID that is not the ID of any student, should throw an error', () => {
    // in an empty database, all IDs are bad :)
    // Note: the expression you expect to throw
    // must be wrapped in a (() => ...)
    expect(() => db.getTranscript(1)).toThrowError();
  });
});

describe('addGrade', () => {
  it('should add the grade to the transcript', () => {
    const studentName = 'test student';
    const courseID = 'test course';
    const studentID = db.addStudent(studentName);
    const grade = 100;
    db.addGrade(studentID, courseID, grade);
    const retrievedGrade = db.getGrade(studentID, courseID);
    expect(retrievedGrade).toStrictEqual({ course: 'test course', grade: 100 });
  });

  it('Should throw an error if the student ID is invalid', () => {
    const studentName = 'test student';
    const courseID = 'test course';
    const studentID = db.addStudent(studentName);
    const badStudentId = studentID + 2; // Assumes this is an invalid ID for this test
    const grade = 100;
    expect(() => db.addGrade(badStudentId, courseID, grade)).toThrow();
  });
});

describe('getGrade', () => {
  it('should fail on an empty transcript', () => {
    const studentName = 'test student';
    const courseID = 'test course';
    const studentId = db.addStudent(studentName);
    expect(() => db.getGrade(studentId, courseID)).toThrow();
  });
});

describe('deleteStudent', () => {
  it('should remove a student from the list of all students', () => {
    const studentName1 = 'test student 1';
    const studentId1 = db.addStudent(studentName1);
    const studentName2 = 'test student 2';
    const studentId2 = db.addStudent(studentName2);
    db.deleteStudent(studentId1);
    expect(db.getAllStudentIDs()).toStrictEqual([studentId2]);
  });
});
