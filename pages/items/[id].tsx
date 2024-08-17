import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import DetailComponent from '../components/DetailComponent';
import { useGetItem } from '@/hooks/useItemData';
import { NewItemData } from '../dto/itemDto';
import { any } from 'zod';
import Layout from '../components/Layout';

const ItemDetail = () => {
    const router = useRouter();
    const { id } = router.query;
const handleButton=()=>{
    router.push("/items")
}
    //item data state for fetching single item
    const [singleItem, SetSingleItem] = useState<NewItemData>({
        name: "",
        manufacturer: "",
        category: "",
        price: 0,
        remark: "",
      });
  //tanstack query for get individual item
  const {
    data: singleItemData,
    isLoading: isSingleItemLoading,
    isError: isSingleItemError,
  } = useGetItem(id);

  useEffect(() => {
    if (singleItemData) {
      SetSingleItem(singleItemData);
    }
  }, [singleItemData]);
  return (
    <Layout>
      <DetailComponent handleButton={handleButton} singleItem={singleItem}/>
    </Layout>
  )
}

export default ItemDetail
