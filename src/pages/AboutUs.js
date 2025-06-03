import React from 'react';

const CourseList = ({ title, courses }) => (
  <div>
    <h3>{title}</h3>
    <ul>
      {courses.map((course, index) => (
        <li key={index}>
          <strong>{course.name}</strong>: {course.description}
        </li>
      ))}
    </ul>
  </div>
);

function AboutUs() {
  const undergraduateCourses = [
    { name: 'Computer Science and Engineering', description: 'Focuses on software development, algorithms, and data structures.' },
    { name: 'Electronics and Communication Engineering', description: 'Covers topics like signal processing, communication systems, and microelectronics.' },
    { name: 'Mechanical Engineering', description: 'Involves the study of mechanics, thermodynamics, and material science.' },
    { name: 'Civil Engineering', description: 'Deals with the design and construction of infrastructure such as roads, bridges, and buildings.' },
    { name: 'Electrical and Electronics Engineering', description: 'Encompasses electrical circuits, power systems, and electronic devices.' },
    { name: 'Information Technology', description: 'Focuses on computer applications, networking, and database management.' },
    { name: 'Chemical Engineering', description: 'Involves the transformation of raw materials into valuable products through chemical processes.' },
    { name: 'Biotechnology Engineering', description: 'Combines biology and technology to develop products and processes for medical and agricultural applications.' },
  ];

  const postgraduateCourses = [
    { name: 'VLSI Design', description: 'Focuses on the design and development of integrated circuits.' },
    { name: 'CAD/CAM', description: 'Involves computer-aided design and manufacturing techniques.' },
    { name: 'Structural Engineering', description: 'Covers the analysis and design of structures like buildings and bridges.' },
    { name: 'Power Systems', description: 'Deals with the generation, transmission, and distribution of electrical power.' },
    { name: 'Software Engineering', description: 'Focuses on the development and maintenance of software applications.' },
  ];

  const diplomaCourses = [
    { name: 'Diploma in Civil Engineering', description: 'Focuses on construction materials, surveying, and structural analysis.' },
    { name: 'Diploma in Electrical Engineering', description: 'Covers electrical circuits and systems.' },
    { name: 'Diploma in Mechanical Engineering', description: 'Involves the study of mechanical systems and manufacturing processes.' },
    { name: 'Diploma in Computer Engineering', description: 'Focuses on computer hardware and software.' },
  ];

  const textStyle = { color: 'white' };

  return (
    <div style={textStyle}>
      <h1>About Us</h1>
      <p>
        Welcome to our institution! We are committed to providing quality education and fostering innovation in the field of technology and engineering. Our dedicated faculty and staff work tirelessly to create an environment that encourages learning, creativity, and personal growth.
      </p>
      <p>
        Established over two decades ago, we have grown into a leading center for technical education, research, and development. Our programs are designed to equip students with the skills and knowledge needed to excel in their careers and contribute meaningfully to society.
      </p>
      <p>
        We believe in holistic development and offer a range of extracurricular activities, industry collaborations, and community engagement opportunities to enrich the student experience.
      </p>

      <CourseList title="Undergraduate Programs (B.Tech/B.E.)" courses={undergraduateCourses} />
      <CourseList title="Postgraduate Programs (M.Tech/M.S.)" courses={postgraduateCourses} />
      <CourseList title="Diploma Courses" courses={diplomaCourses} />
    </div>
  );
}

export default AboutUs;
