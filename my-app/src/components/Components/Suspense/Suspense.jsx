import React, { Suspense } from 'react'

export default function SuspenseComponent({children}) {
    return <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>;
}
