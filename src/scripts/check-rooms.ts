import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { ChatRoomRepository } from '../modules/chat/repositories/chat-room.repository';

async function test() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const chatRoomRepo = app.get(ChatRoomRepository);
  
  try {
    console.log('Checking chat room for match 7...');
    const room = await chatRoomRepo.findByMatch(7);
    console.log('Chat room for match 7:', room ? `ID: ${room.id}` : 'Not found');
    
    console.log('\nChecking all chat rooms...');
    const allRooms = await chatRoomRepo['repo'].find({
      relations: ['match']
    });
    
    allRooms.forEach(room => {
      console.log(`Room ID: ${room.id}, Match ID: ${room.match?.id}, Created: ${room.createdAt}`);
    });
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await app.close();
  }
}

test().catch(console.error);
