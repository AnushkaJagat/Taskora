import { Body, Bind, Controller, Get, Param, Post, Put,} from "@nestjs/common";

import { AuthService } from "./auth.service.js";

@Controller("auth")
export class AuthController {
  constructor() {
    this.authService = new AuthService();
  }

  @Post("register")
  @Bind(Body())
  async register(body) {
    return this.authService.register(body);
  }

  @Post("login")
  @Bind(Body())
  async login(body) {
    return this.authService.login(
      body.email,
      body.password
    );
  }

  @Get("users")
  async getUsers() {
    return await this.authService.getUsers();
  }

  @Get("profile/:id")
  @Bind(Param("id"))
  async getProfile(id) {
    return this.authService.getProfile(id);
  }

  @Put("profile/:id")
  @Bind(Param("id"), Body())
  async updateProfile(id, body) {
    return this.authService.updateProfile(id, body);
  }
}