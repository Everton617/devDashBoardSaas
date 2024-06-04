import Link from 'next/link';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { type ReactElement, useEffect } from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import type { NextPageWithLayout } from 'types';
import { authProviderEnabled } from '@/lib/auth';
import { AuthLayout } from '@/components/layouts';
import { JoinWithInvitation, Join } from '@/components/auth';
import Head from 'next/head';
import { Loading } from '@/components/shared';
import env from '@/lib/env';

const Signup: NextPageWithLayout<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ authProviders, recaptchaSiteKey }) => {
  const router = useRouter();
  const { status } = useSession();
  const { t } = useTranslation('common');

  const { error, token } = router.query as {
    error: string;
    token: string;
  };

  useEffect(() => {
    if (error) {
      toast.error(t(error));
    }
  }, [error, t]);

  if (status === 'loading') {
    return <Loading />;
  }

  if (status === 'authenticated') {
    router.push(env.redirectIfAuthenticated);
  }

  const params = token ? `?token=${token}` : '';

  return (
    <>
      <Head>
        <title>{t('sign-up-title')}</title>
      </Head>
      <div className="rounded p-6 border">
       

        {authProviders.credentials && (
          <>
            {token ? (
              <JoinWithInvitation
                inviteToken={token}
                recaptchaSiteKey={recaptchaSiteKey}
              />
            ) : (
              <Join recaptchaSiteKey={recaptchaSiteKey} />
            )}
          </>
        )}
      </div>
      <p className="text-center text-sm text-gray-600 mt-3">
        {t('Já tem uma conta?')}
        <Link
          href={`/auth/login/${params}`}
          className="font-medium text-red-500 hover:text-black"
        >
          &nbsp;{t('Conecte-se')}
        </Link>
      </p>
    </>
  );
};

Signup.getLayout = function getLayout(page: ReactElement) {
  return (
    <AuthLayout heading="Comece Agora" description="Crie uma nova conta">
      {page}
    </AuthLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { locale } = context;

  return {
    props: {
      ...(locale ? await serverSideTranslations(locale, ['common']) : {}),
      authProviders: authProviderEnabled(),
      recaptchaSiteKey: env.recaptcha.siteKey,
    },
  };
};

export default Signup;
