'use client';
import Container from "../Container";
import { TbBeach, TbMountain, TbPool } from 'react-icons/tb';
import { GiBarn, GiBoatFishing, GiCactus, GiCastle, GiCaveEntrance, GiForestCamp, GiIsland, GiWindmill } from 'react-icons/gi';
import { MdOutlineVilla } from 'react-icons/md';
import CategoryBox from "../CategoryBox";
import { usePathname, useSearchParams } from "next/navigation";
import { FaSkiing } from "react-icons/fa";
import { BsSnow } from "react-icons/bs";
import { IoDiamond } from "react-icons/io5";

export const categories = [
    {
        label: 'Beach',
        icon: TbBeach,
        description: 'this property is close to the beach!'
    },
    {
        label: 'City',
        icon: MdOutlineVilla,
        description: 'this property is modern!'
    },
    {
        label: 'Countryside',
        icon: TbMountain,
        description: 'this property is in the countryside!'
    },
    {
        label: 'Pools',
        icon: TbPool,
        description: 'this property has a pool!'
    },
    {
        label: 'Desert',
        icon: GiCactus,
        description: 'this property is in the desert!'
    },
    {
        label: 'Lux',
        icon: IoDiamond,
        description: 'this property is luxurious!'
    },

]
const Categories = () => {  
    const params = useSearchParams();
    const category = params?.get('category');
    const pathname = usePathname();

    const isMainPage = pathname === '/';

    if (!isMainPage) {
        return null;
    }
    return (
    <Container>
        <div 
        className="
            pt-4
            flex
            flex-row
            items-center
            justify-between
            overflox-x-auto
        ">
            {categories.map((item) => (
                <CategoryBox 
                key={item.label}
                label={item.label}
                selected={category === item.label}
                icon={item.icon}
                />
            ))}
        </div>
    </Container>
    );
}

export default Categories;