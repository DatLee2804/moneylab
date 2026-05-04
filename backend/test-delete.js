const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testDelete() {
  try {
    const users = await prisma.user.findMany({ take: 2 });
    if (users.length === 0) {
      console.log('No users found');
      return;
    }
    const userToTest = users[0];
    console.log('Testing delete for user:', userToTest.id);
    
    await prisma.user.delete({ where: { id: userToTest.id } });
    console.log('Delete successful');
  } catch (error) {
    console.error('Delete failed:');
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

testDelete();
