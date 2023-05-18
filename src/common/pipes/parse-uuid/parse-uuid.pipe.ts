import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParseUUIDPipe implements PipeTransform {
  private readonly _uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  transform(value: string | string[]) {
    if (Array.isArray(value)) {
      for (const uuid of value) {
        this._assert(uuid);
      }
    } else {
      this._assert(value);
    }

    return value;
  }

  private _assert(value: string) {
    if (!this._uuidRegex.test(value)) {
      throw new BadRequestException(`The value '${value}' is not a valid UUID`);
    }
  }
}
