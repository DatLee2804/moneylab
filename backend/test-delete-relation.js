const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testDelete() {
  try {
    const usersWithCourses = await prisma.user.findMany({
      where: {
        OR: [
          { courses: { some: {} } },
          { enrollments: { some: {} } },
          { transactions: { some: {} } }
        ]
      },
      take: 1
    });

    if (usersWithCourses.length === 0) {
      console.log('No user with relations found');
      return;
    }
    const userToTest = usersWithCourses[0];
    console.log('Testing delete for user with relations:', userToTest.id);
    
    await prisma.user.delete({ where: { id: userToTest.id } });
    console.log('Delete successful');
  } catch (error) {
    console.error('Delete failed with error code:', error.code);
    console.error('Full message:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testDelete();
