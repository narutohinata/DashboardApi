import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { ObjectSchema } from 'joi';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private schema: ObjectSchema) {}

  transform(value: any, metadata: ArgumentMetadata) {
    console.log('metadata', metadata);
    const { error } = this.schema.validate(value);
    console.log(error);
    if (error) {
      throw new BadRequestException('validation failed');
    }
    return value;
  }
}
