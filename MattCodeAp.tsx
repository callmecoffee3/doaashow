
'use client';

import React from 'react';
import AppLayout from './AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { BrainCircuit } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { ScrollArea } from '../ui/scroll-area';

const categoryStructure = [
    { title: "Design & Displays", items: ["Logo", "Navigation", "Color Scheme"] },
    { title: "Main Content", items: ["Home", "About", "Contact"] },
    { title: "User Interactions", items: ["Login", "Register", "Forgot Password"] },
    { title: "Game/Features", items: ["Start", "Pause", "Settings"] },
    { title: "Settings/Options", items: ["Sound", "Difficulty", "Language"] },
    { title: "Chatbot/AI Integration", items: ["Greetings", "Responses", "Intents"] },
    { title: "Search & Filter", items: ["Search Bar", "Filter Options", "Results Display"] },
    { title: "Extensions", items: ["Social Media Integration", "Payment Gateway", "Email Marketing", "Analytics Tracking", "SEO Optimization"] },
    { title: "Additional Extensions (Optional)", items: ["Forum/Discussion Board", "E-commerce Functionality", "Membership/Subscription Model", "API Integrations"] }
];

const tableData = [
    { code: '(c0, r0)', list: '1', location: 'Header', description: 'Website Name' },
    { code: '(c1, r1)', list: '2.1', location: 'Design & Displays', description: 'Logo' },
    { code: '(c1, r2)', list: '2.2', location: 'Design & Displays', description: 'Navigation' },
    { code: '(c1, r3)', list: '2.3', location: 'Design & Displays', description: 'Color Scheme' },
    { code: '(c2, r1)', list: '3.1', location: 'Main Content', description: 'Home' },
    { code: '(c2, r2)', list: '3.2', location: 'Main Content', description: 'About' },
    { code: '(c2, r3)', list: '3.3', location: 'Main Content', description: 'Contact' },
    { code: '(c3, r1)', list: '4.1', location: 'User Interactions', description: 'Login' },
    { code: '(c3, r2)', list: '4.2', location: 'User Interactions', description: 'Register' },
    { code: '(c3, r3)', list: '4.3', location: 'User Interactions', description: 'Forgot Password' },
    { code: '(c4, r1)', list: '5.1', location: 'Game/Features', description: 'Start' },
    { code: '(c4, r2)', list: '5.2', location: 'Game/Features', description: 'Pause' },
    { code: '(c4, r3)', list: '5.3', location: 'Game/Features', description: 'Settings' },
    { code: '(c5, r1)', list: '6.1', location: 'Settings/Options', description: 'Sound' },
    { code: '(c5, r2)', list: '6.2', location: 'Settings/Options', description: 'Difficulty' },
    { code: '(c5, r3)', list: '6.3', location: 'Settings/Options', description: 'Language' },
    { code: '(c6, r1)', list: '7.1', location: 'Chatbot/AI Integration', description: 'Greetings' },
    { code: '(c6, r2)', list: '7.2', location: 'Chatbot/AI Integration', description: 'Responses' },
    { code: '(c6, r3)', list: '7.3', location: 'Chatbot/AI Integration', description: 'Intents' },
    { code: '(c7, r1)', list: '8.1', location: 'Search & Filter', description: 'Search Bar' },
    { code: '(c7, r2)', list: '8.2', location: 'Search & Filter', description: 'Filter Options' },
    { code: '(c7, r3)', list: '8.3', location: 'Search & Filter', description: 'Results Display' },
    { code: '(c8, r1)', list: '9.1', location: 'Extensions', description: 'Social Media Integration' },
    { code: '(c8, r2)', list: '9.2', location: 'Extensions', description: 'Payment Gateway' },
    { code: '(c8, r3)', list: '9.3', location: 'Extensions', description: 'Email Marketing' },
    { code: '(c8, r4)', list: '9.4', location: 'Extensions', description: 'Analytics Tracking' },
    { code: '(c8, r5)', list: '9.5', location: 'Extensions', description: 'SEO Optimization' },
    { code: '(c9, r1)', list: '10.1', location: 'Additional Extensions', description: 'Forum/Discussion Board' },
    { code: '(c9, r2)', list: '10.2', location: 'Additional Extensions', description: 'E-commerce Functionality' },
    { code: '(c9, r3)', list: '10.3', location: 'Additional Extensions', description: 'Membership/Subscription Model' },
    { code: '(c9, r4)', list: '10.4', location: 'Additional Extensions', description: 'API Integrations' }
];

const menuOptions = [
    { title: "Menu Options", items: ["Display Menu Items", "Modify Menu Items", "Remove Menu Items", "Save Data", "Load Data", "Close Menu"] },
    { title: "Character Menu Options", items: ["View Character Details", "Edit Character", "Add Character", "Delete Character"] },
    { title: "Film Menu Options", items: ["View Film Details", "Edit Film", "Add Film", "Delete Film"] }
];

export default function MattCodeApp({ appId }: { appId: string }) {
    return (
        <AppLayout appId={appId}>
            <div className="flex flex-col h-full">
                <div className="p-4 border-b">
                    <CardHeader className="p-0">
                        <CardTitle className="flex items-center gap-2 font-headline">
                            <BrainCircuit /> Matt Code Structure
                        </CardTitle>
                        <CardDescription>
                            Project Name: The Run of King God - A Divine Realm Adventure
                        </CardDescription>
                    </CardHeader>
                </div>

                <Tabs defaultValue="structure" className="flex-1 flex flex-col min-h-0">
                    <div className="px-4 py-2 border-b">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="structure">Structure</TabsTrigger>
                            <TabsTrigger value="table">Table Chart</TabsTrigger>
                            <TabsTrigger value="menus">Menu Options</TabsTrigger>
                        </TabsList>
                    </div>
                    <ScrollArea className="flex-1">
                        <div className="p-4">
                            <TabsContent value="structure">
                                <Card>
                                    <CardContent className="p-4">
                                        <Accordion type="multiple" defaultValue={["Design & Displays"]}>
                                            {categoryStructure.map(category => (
                                                <AccordionItem key={category.title} value={category.title}>
                                                    <AccordionTrigger>{category.title}</AccordionTrigger>
                                                    <AccordionContent>
                                                        <ul className="list-disc list-inside space-y-1 pl-4">
                                                            {category.items.map(item => <li key={item}>{item}</li>)}
                                                        </ul>
                                                    </AccordionContent>
                                                </AccordionItem>
                                            ))}
                                        </Accordion>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                            <TabsContent value="table">
                                <Card>
                                    <CardContent className="p-4">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Code</TableHead>
                                                    <TableHead>List #</TableHead>
                                                    <TableHead>Location</TableHead>
                                                    <TableHead>Description</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {tableData.map(row => (
                                                    <TableRow key={row.code}>
                                                        <TableCell className="font-mono">{row.code}</TableCell>
                                                        <TableCell>{row.list}</TableCell>
                                                        <TableCell>{row.location}</TableCell>
                                                        <TableCell>{row.description}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                            <TabsContent value="menus">
                                <div className="grid md:grid-cols-3 gap-4">
                                    {menuOptions.map(menu => (
                                        <Card key={menu.title}>
                                            <CardHeader>
                                                <CardTitle className="text-lg">{menu.title}</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <ul className="list-disc list-inside space-y-2">
                                                    {menu.items.map(item => <li key={item}>{item}</li>)}
                                                </ul>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </TabsContent>
                        </div>
                    </ScrollArea>
                </Tabs>
            </div>
        </AppLayout>
    );
}
