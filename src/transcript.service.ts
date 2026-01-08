import {
  type StudentID,
  type Student,
  type Course,
  type CourseGrade,
  type Transcript,
} from './types.ts';

export interface TranscriptService {
  addStudent(studentName: string): StudentID;
  getTranscript(id: StudentID): Transcript; // throws Error if id invalid
  deleteStudent(id: StudentID): void; // throws Error if id invalid
  addGrade(id: StudentID, courseName: string, courseGrade: number): void;
  getGrade(id: StudentID, course: Course): CourseGrade;
  nameToIDs(studentName: string): StudentID[];
  getAllStudentIDs(): StudentID[];
}

export class TranscriptDB implements TranscriptService {
  /**
   * The list of transcripts in the database
   */
  private _transcripts: Transcript[] = [];

  /**
   * The last assigned student ID
   */
  private _lastID: number;

  constructor() {
    this._lastID = 0;
  }

  /**
   * Adds a new student to the database
   * @param {string} newName - the name of the student
   * @returns {StudentID} - the newly-assigned ID for the new student
   */
  addStudent(newName: string): StudentID {
    this._lastID += 1;
    const newID = this._lastID;
    const newStudent: Student = { studentID: newID, studentName: newName };
    this._transcripts.push({ student: newStudent, grades: [] });
    return newID;
  }

  /**
   * Find all IDs associated with a specific student's name
   * @param studentName
   * @returns list of studentIDs associated with that name
   */
  nameToIDs(studentName: string): StudentID[] {
    return this._transcripts
      .filter(t => t.student.studentName === studentName)
      .map(t => t.student.studentID);
  }

  /**
   * Returns the index of the transcript for a given student ID in the database.
   * If this function returns successfully, the id can be assumed to be a valid
   * student ID.
   *
   * @param id - the id to look up
   * @returns the index of this transcript for this student ID in the `_transcripts` array
   * @throws if the there is no transcript with the given student ID
   */
  _getIndexForId(id: StudentID): number {
    const index: number = this._transcripts.findIndex(t => t.student.studentID === id);
    if (index === -1) {
      throw new Error(`Transcript not found for student with ID ${id}`);
    }
    return index;
  }

  /**
   * Returns the transcript for a student
   *
   * @param id - a student ID
   * @returns the transcript for this student with this ID
   * @throws if the there is no transcript with the given student ID
   */
  getTranscript(id: StudentID): Transcript {
    const index = this._getIndexForId(id);
    return this._transcripts[index];
  }

  /**
   * Permanently removes the transcript for a student
   *
   * @param id - a student ID
   * @throws if the there is no transcript with the given student ID
   */
  deleteStudent(id: StudentID): void {
    const index = this._getIndexForId(id);
    this._transcripts.splice(index, 1); // remove the transcript from the array
  }

  /**
   * Adds a grade for a student
   *
   * @param id - a student ID
   * @param courseName - Name of the course
   * @param courseGrade - Student's grade in the course
   * @throws if the there is no transcript with the given student ID
   */
  addGrade(id: StudentID, courseName: Course, courseGrade: number): void {
    const index = this._getIndexForId(id);
    this._transcripts[index].grades.push({ course: courseName, grade: courseGrade });
  }

  /**
   * Gets the grade record for a student in a specific course
   *
   * @param id - a student ID
   * @param courseName - Name of the course
   * @throws if the there is no transcript with the given student ID, or if a student does not have a grade in that course
   */
  getGrade(id: StudentID, courseName: Course): CourseGrade {
    const index = this._getIndexForId(id);
    const transcript = this._transcripts[index];
    const course = transcript.grades.find(grade => grade.course === courseName);

    if (!course) {
      throw new Error(
        `Grades for course ${courseName} not found for student ${transcript.student.studentName} (ID: ${id})`,
      );
    }
    return course;
  }

  /**
   * Returns all stored student IDs
   *
   * @returns An array containing every valid student ID
   */
  getAllStudentIDs(): StudentID[] {
    return this._transcripts.map(t => t.student.studentID);
  }
}
