import React from 'react';
import { WhyAttendData } from '../lib/models';
import { Test } from '@uniformdev/context-react';
import { TestVariant } from '@uniformdev/context';
import Image from 'next/image';

enum PhotoLocation {
  Left = 'left',
  Right = 'right',
}

type WhyAttendProps = WhyAttendData & {
  photoLocation: PhotoLocation | string;
};

const locationVariants: TestVariant[] = [{ id: PhotoLocation.Left }, { id: PhotoLocation.Right }];

export const WhyAttendTestPhotoLocation = (props: WhyAttendData) => {
  return (
    <Test
      name="Why Attend Photo Location Test"
      variations={locationVariants}
      component={({ id }) => <WhyAttend {...props} photoLocation={id} />}
    />
  );
};

export const WhyAttend = ({ title, description, image, photoLocation }: WhyAttendProps) => (
  <section className="bg-white border-b py-8">
    <div className="container max-w-5xl mx-auto m-8">
      <h1 className="w-full my-2 text-5xl font-bold leading-tight text-center text-gray-800">
        {title}
      </h1>
      <div className="w-full mb-4">
        <div className="h-1 mx-auto gradient w-64 opacity-25 my-0 py-0 rounded-t" />
      </div>
      {photoLocation === PhotoLocation.Left ? (
        <ImageLeftCallout description={description} image={image} />
      ) : (
        <ImageRightCallout description={description} image={image} />
      )}
    </div>
  </section>
);

type CalloutProps = {
  description: string;
  image: string;
}; 

const ImageRightCallout = ({ description, image }: CalloutProps) => {
  return (
    <div className="flex flex-wrap">
      <div className="w-5/6 sm:w-1/2 p-6">
        <p className="text-gray-600 mb-8" dangerouslySetInnerHTML={{ __html: description }} />
      </div>
      <div className="w-full sm:w-1/2 p-6">
        <Image
          src={image}
          layout="responsive"
          loading="lazy"
          className="w-full sm:h-64 mx-auto"
          height={373}
          width={560}
        />
      </div>
    </div>
  );
};

const ImageLeftCallout = ({ description, image }: CalloutProps) => {
  return (
    <div className="flex flex-wrap flex-col-reverse sm:flex-row">
      <div className="w-full sm:w-1/2 p-6 mt-6">
        <Image
          src={image}
          layout="responsive"
          loading="lazy"
          className="w-5/6 sm:h-64 mx-auto"
          height={373}
          width={560}
        />
      </div>
      <div className="w-full sm:w-1/2 p-6 mt-6">
        <div className="align-middle">
          <p className="text-gray-600 mb-8" dangerouslySetInnerHTML={{ __html: description }} />
        </div>
      </div>
    </div>
  );
};