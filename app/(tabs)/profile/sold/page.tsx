import React from 'react';

async function  Page({
                         params,
                     }: {
    params: { id: number };
}) {
    console.log(params)
    return (
        <div className="py-10 px-4">
            sold
        </div>);
}

export default Page;