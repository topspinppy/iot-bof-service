db = db.getSiblingDB('iot-bof-service');

db.users.insertMany([
  {
    _id: ObjectId('6672ebfe2e54e64231e9a7ce'),
    userName: 'admin1',
    password: '$2b$10$NIzc/YpFbG1B9WFmVlTjAevePvPj0X86vB.4cFitDaPviKtsAIsXi',
    fullName: 'Admin',
    email: 'admin1@test.com',
  },
]);

print('Database seeded successfully');
