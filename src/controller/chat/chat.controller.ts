import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { RatingDto } from './dto/message';

@ApiTags('chat')
@Controller('chat')
export class ChatController {
    constructor(
        private chatService: ChatService,
    ) { }

    @Get('GetMessages/:room')
    GetMessages(@Param('room') room: string) {
        return this.chatService.GetMessages(room);
    }

    @Post('Ratings')
    Ratings(@Body() RatingDto: RatingDto) {
        return this.chatService.Rating(RatingDto);
    }

    @Get('GetRatings')
    GetRatings() {
        return this.chatService.GetRatings();
    }
}
