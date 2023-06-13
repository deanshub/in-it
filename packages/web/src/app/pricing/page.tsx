import { Button } from '@/components/basic/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/basic/card';
// import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useMemo } from 'react';

export default function PricingPage() {
  const plans = useMemo(
    () => [
      {
        name: 'Free',
        description: 'Analyze your bundles for free',
        price: 0,
        features: ['Local bundle analyzing', 'Local diffing', 'File size limitting'],
      },
      {
        name: 'Pro',
        description: 'Access to all features',
        price: 10,
        features: [
          'Access all CI history',
          'Store versions of all branches',
          'File size limitting',
          'Diffing between all versions',
        ],
      },
      {
        name: 'Enterprise',
        description: 'Access to all features for all your projects',
        features: [
          'Pay once for all of your projects',
          'Access all CI history',
          'Store versions of all branches',
          'File size limitting',
          'Diffing between all versions',
          'Privacy control',
        ],
      },
    ],
    [],
  );

  //   const handleStartTrial = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
  //     e.preventDefault();
  //     signIn('github', { callbackUrl: '/analyze' });
  //   };

  return (
    <div className="prose dark:prose-dark pb-14 px-24 leading-loose gap-10 justify-center flex flex-col">
      <div className="flex gap-10 justify-center pt-5">
        {plans.map((plan) => {
          const priceText =
            plan.price !== undefined ? (
              `${plan.price}$ per month / project`
            ) : (
              <>
                <a className="underline" href="mailto:support@nissix.com">
                  Contact us
                </a>
                for pricing
              </>
            );
          return (
            <Card key={plan.name} className="w-96 drop-shadow flex flex-col bg-violet-700">
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="text-xl">{priceText}</CardContent>
              <CardFooter className="flex flex-col gap-4 items-start flex-1">
                <ul className="list-disc ml-4 flex-1">
                  {plan.features.map((feature) => {
                    return <li key={feature}>{feature}</li>;
                  })}
                </ul>
                <Button
                //   onClick={handleStartTrial}
                >
                  <Link href="/api/auth/signin/github">Start free trial</Link>
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
      <div className="text-center text-lg italic">
        We offer in-it for free for open-source projects and non-profit organizations. If you are
        working on a non-commercial side project and not generating revenue from it, kindly
        <a href="mailto:support@nissix.com" className="mx-1 underline">
          inform us
        </a>
        with your project details, and we will be happy to assist you.
      </div>
    </div>
  );
}
