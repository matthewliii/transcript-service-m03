import { beforeEach, describe, expect, it } from 'vitest';
import { TranscriptDB, type TranscriptService } from './transcript.service.ts';

let db: TranscriptService;
beforeEach(() => {
  db = new TranscriptDB();
});

// 40: innoculous. It is innoculous because it doesn't matter if the id if positive or negative. Just needs to be unique.
// 43: non-innoculous (incorrect grade type)
// 53: non-innoculous (incorrect behavior)
// 54: non-innoculous (incorrect behavior)
// 70: innoculous (just throws the wrong error message but wont be a bug). This error message will only be unhelpful for debugging, but won't cause any errors in the code
// 121: non-innoculous (incorrect filter behavior)
// 125: innoculous (wrong error message but won't be a bug). It will not affect the code behavior, just the error message.

// for line 43
describe('addStudent', () => {
  it('Should add a student to the transcript without any grades initially', () => {
    const studentName = 'test student';
    const studentId = db.addStudent(studentName);
    // expect the grades in the transcript to be empty
    expect(db.getTranscript(studentId).grades).toStrictEqual([]);
  });
});

//for line 53 and 54
describe('nameToIDs', () => {
  it('only IDs associated to specific student name are returned', () => {
    const id1 = db.addStudent('blair');
    const id2 = db.addStudent('corey');
    const id3 = db.addStudent('del');

    const ids = db.nameToIDs('blair');

    expect(ids).toContain(id1);
    expect(ids).not.toContain(id2);
    expect(ids).not.toContain(id3);
  });
});

// for line 121
describe('getGrade', () => {
  it('should distinguish between different courses for same student', () => {
    const studentId = db.addStudent('David');

    db.addGrade(studentId, 'Physics', 75);
    db.addGrade(studentId, 'Chemistry', 95);

    const physicsGrade = db.getGrade(studentId, 'Physics');
    const chemistryGrade = db.getGrade(studentId, 'Chemistry');

    expect(physicsGrade.grade).toBe(75);
    expect(chemistryGrade.grade).toBe(95);
  });
});
