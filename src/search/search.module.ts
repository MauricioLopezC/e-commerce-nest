import { Module } from '@nestjs/common';

@Module({})
// to implment search functionality switch from sqlte to postgres, which suportt full text search 
// or fuzzy find search
export class SearchModule { }
