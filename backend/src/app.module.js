import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { TaskModule } from "./tasks/task.module.js";
import { AuthModule } from "./auth/auth.module.js";
import { ProjectModule } from "./projects/project.module.js";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TaskModule,
    AuthModule,
    ProjectModule,
  ],
})
export class AppModule {}