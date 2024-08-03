export const Providers = {
	KAKAO: {
		redirectUri: `${process.env.FRONTEND_URL}/oauth/callback/kakao`,
		clientId: process.env.KAKAO_CLIENT_ID,
		urls: {
			token: 'https://kauth.kakao.com/oauth/token',
			authorize: 'https://kauth.kakao.com/oauth/authorize',
			me: 'https://kapi.kakao.com/v2/user/me',
		},
	},
} as const;
