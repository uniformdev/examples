import React from 'react';
import { Personalize } from '@uniformdev/context-react';
import { TalkData, TalksListData } from '../lib/models';

export const TalkList: React.FC<TalksListData> = ({ talks, count, title, p13nTitle }) => {
  return (
    <section className="bg-white border-b py-8">
      <div className="container mx-auto flex flex-wrap pt-4 pb-12">
        <Personalize
          variations={talks}
          component={(props) => <TalkListItem {...props} />}
          count={count}
          name="talkListPersonalized"
          wrapperComponent={({ personalizationOccurred, children }) => (
            <>
              <h1 className="w-full my-2 text-5xl font-bold leading-tight text-center text-gray-800">
                {personalizationOccurred ? p13nTitle : title}
              </h1>
              <div className="w-full mb-4">
                <div className="h-1 mx-auto gradient w-64 opacity-25 my-0 py-0 rounded-t" />
              </div>
              {children}
            </>
          )}
        />
      </div>
    </section>
  );
};

const TalkListItem = ({ title, description, tags }: TalkData) => {
  return (
    <div className="w-full md:w-1/3 p-6 flex flex-col flex-grow flex-shrink">
      <div className="flex-1 bg-white rounded-t rounded-b-none overflow-hidden shadow space-y-2 pt-2">
        <div className="flex-none mt-auto bg-white rounded-b rounded-t-none overflow-hidden">
          <div className="mt-3 mb-3 flex items-center justify-start">
            {tags.map((tag, index) => (
              <span key={index} className="ml-6 px-6 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <a href="#" className="flex flex-wrap no-underline hover:no-underline">
          <div className="w-full font-bold text-xl text-gray-800 px-6">{title}</div>
        </a>
        <div
          className="text-gray-800 px-6 pb-6 text-sm"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      </div>
    </div>
  );
};