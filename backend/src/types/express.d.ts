declare global {
  namespace Express {
    interface Request {
      userId?: string
      profileId?: string
    }
  }
}

export {}

