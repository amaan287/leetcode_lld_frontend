'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

type Section = 'introduction' | 'principles' | 'design-patterns' | 'best-practices' | 'interview-questions';

export default function TheoryPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<Section>('introduction');

  if (!isAuthenticated()) {
    router.push('/auth/login');
    return null;
  }

  const designPatterns = {
    creational: [
      {
        name: 'Factory Method',
        description: 'Provides an interface for creating objects in a superclass, but allows subclasses to alter the type of objects that will be created.',
        useCase: 'Use when you don\'t know beforehand the exact types and dependencies of the objects your code should work with.'
      },
      {
        name: 'Abstract Factory',
        description: 'Lets you produce families of related objects without specifying their concrete classes.',
        useCase: 'Use when you need to work with various families of related products, but you don\'t want to depend on their concrete classes.'
      },
      {
        name: 'Builder',
        description: 'Allows you to construct complex objects step by step. The pattern allows you to produce different types and representations of an object using the same construction code.',
        useCase: 'Use when you want to construct complex objects step by step, or when construction involves multiple steps.'
      },
      {
        name: 'Prototype',
        description: 'Lets you copy existing objects without making your code dependent on their classes.',
        useCase: 'Use when your code shouldn\'t depend on the concrete classes of objects you need to copy, or when you want to reduce the number of subclasses.'
      },
      {
        name: 'Singleton',
        description: 'Ensures that a class has only one instance, while providing a global access point to this instance.',
        useCase: 'Use when a class in your program should have just a single instance available to all clients.'
      }
    ],
    structural: [
      {
        name: 'Adapter',
        description: 'Allows objects with incompatible interfaces to collaborate.',
        useCase: 'Use when you want to use an existing class, but its interface isn\'t compatible with the rest of your code.'
      },
      {
        name: 'Bridge',
        description: 'Lets you split a large class or a set of closely related classes into two separate hierarchies—abstraction and implementation—which can be developed independently.',
        useCase: 'Use when you want to divide and organize a monolithic class that has several variants of some functionality.'
      },
      {
        name: 'Composite',
        description: 'Lets you compose objects into tree structures and then work with these structures as if they were individual objects.',
        useCase: 'Use when you have to implement a tree-like object structure and want to treat simple and complex elements uniformly.'
      },
      {
        name: 'Decorator',
        description: 'Allows you to attach new behaviors to objects by placing these objects inside special wrapper objects that contain the behaviors.',
        useCase: 'Use when you need to assign extra behaviors to objects at runtime without breaking the code that uses these objects.'
      },
      {
        name: 'Facade',
        description: 'Provides a simplified interface to a library, a framework, or any other complex set of classes.',
        useCase: 'Use when you need to have a limited but straightforward interface to a complex subsystem.'
      },
      {
        name: 'Flyweight',
        description: 'Lets you fit more objects into the available amount of RAM by sharing common parts of state between multiple objects instead of keeping all of the data in each object.',
        useCase: 'Use when you need to create a huge number of similar objects and want to reduce memory usage.'
      },
      {
        name: 'Proxy',
        description: 'Provides a substitute or placeholder for another object. A proxy controls access to the original object, allowing you to perform something either before or after the request gets through to the original object.',
        useCase: 'Use when you want to add some additional behaviors to an object while keeping the client code unchanged.'
      }
    ],
    behavioral: [
      {
        name: 'Chain of Responsibility',
        description: 'Lets you pass requests along a chain of handlers. Upon receiving a request, each handler decides either to process the request or to pass it to the next handler in the chain.',
        useCase: 'Use when your program is expected to process different kinds of requests in various ways, but the exact types of requests and their sequences are unknown beforehand.'
      },
      {
        name: 'Command',
        description: 'Turns a request into a stand-alone object that contains all information about the request. This transformation lets you parameterize methods with different requests, delay or queue a request\'s execution, and support undoable operations.',
        useCase: 'Use when you want to parameterize objects with operations, queue operations, schedule their execution, or execute them remotely.'
      },
      {
        name: 'Iterator',
        description: 'Lets you traverse elements of a collection without exposing its underlying representation (list, stack, tree, etc.).',
        useCase: 'Use when you want to traverse a collection without exposing its internal structure, or when you want to support multiple ways of traversal.'
      },
      {
        name: 'Mediator',
        description: 'Reduces chaotic dependencies between objects. The pattern restricts direct communications between objects and forces them to collaborate only via a mediator object.',
        useCase: 'Use when it\'s hard to change some of the classes because they are tightly coupled to a bunch of other classes.'
      },
      {
        name: 'Memento',
        description: 'Lets you save and restore the previous state of an object without revealing the details of its implementation.',
        useCase: 'Use when you want to produce snapshots of the object\'s state to be able to restore a previous state of the object.'
      },
      {
        name: 'Observer',
        description: 'Lets you define a subscription mechanism to notify multiple objects about any events that happen to the object they\'re observing.',
        useCase: 'Use when changes to the state of one object may require changing other objects, and the actual set of objects is unknown beforehand or changes dynamically.'
      },
      {
        name: 'State',
        description: 'Lets an object alter its behavior when its internal state changes. It appears as if the object changed its class.',
        useCase: 'Use when you have an object that behaves differently depending on its current state, the number of states is enormous, and the state-specific code changes frequently.'
      },
      {
        name: 'Strategy',
        description: 'Lets you define a family of algorithms, put each of them in a separate class, and make their objects interchangeable.',
        useCase: 'Use when you want to use different variants of an algorithm within an object and be able to switch from one algorithm to another during runtime.'
      },
      {
        name: 'Template Method',
        description: 'Defines the skeleton of an algorithm in the superclass but lets subclasses override specific steps of the algorithm without changing its structure.',
        useCase: 'Use when you want to let clients extend only particular steps of an algorithm, but not the whole algorithm or its structure.'
      },
      {
        name: 'Visitor',
        description: 'Lets you separate algorithms from the objects on which they operate.',
        useCase: 'Use when you need to perform an operation on all elements of a complex object structure (for example, an object tree).'
      }
    ]
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'introduction':
        return (
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Introduction to Low-Level Design</h2>
            <p className="text-gray-700 mb-4">
              Low-Level Design (LLD) is a detailed design phase that focuses on the implementation details
              of a system. It involves designing classes, interfaces, data structures, and algorithms that
              will be used to build the system.
            </p>
            <p className="text-gray-700 mb-4">
              LLD bridges the gap between high-level system design and actual code implementation. It focuses
              on how individual components interact, how data flows through the system, and how specific
              functionalities are implemented at a granular level.
            </p>
          </section>
        );

      case 'principles':
        return (
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Key Principles</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">SOLID Principles</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li><strong>Single Responsibility:</strong> A class should have only one reason to change</li>
                  <li><strong>Open/Closed:</strong> Open for extension, closed for modification</li>
                  <li><strong>Liskov Substitution:</strong> Derived classes must be substitutable for their base classes</li>
                  <li><strong>Interface Segregation:</strong> Clients shouldn't depend on interfaces they don't use</li>
                  <li><strong>Dependency Inversion:</strong> Depend on abstractions, not concretions</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Other Key Principles</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li><strong>DRY (Don't Repeat Yourself):</strong> Avoid code duplication</li>
                  <li><strong>Separation of Concerns:</strong> Each class should have a single, well-defined purpose</li>
                  <li><strong>Encapsulation:</strong> Hide internal implementation details</li>
                  <li><strong>Abstraction:</strong> Focus on what rather than how</li>
                  <li><strong>KISS (Keep It Simple, Stupid):</strong> Simplicity should be a key goal</li>
                  <li><strong>YAGNI (You Aren't Gonna Need It):</strong> Don't add functionality until it's necessary</li>
                </ul>
              </div>
            </div>
          </section>
        );

      case 'design-patterns':
        return (
          <section>
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Design Patterns</h2>
              <p className="text-gray-700 mb-4">
                Design patterns are typical solutions to common problems in software design. Each pattern is like a blueprint
                that you can customize to solve a particular design problem in your code. Reference:{' '}
                <a href="https://refactoring.guru/design-patterns" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  refactoring.guru
                </a>
              </p>
            </div>

            <div className="space-y-8">
              {/* Creational Patterns */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  Creational Patterns
                </h3>
                <p className="text-gray-600 mb-4 text-sm">
                  These patterns provide various object creation mechanisms, enhancing flexibility and reuse of existing code.
                </p>
                <div className="space-y-6">
                  {designPatterns.creational.map((pattern, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">{pattern.name}</h4>
                      <p className="text-gray-700 mb-2">{pattern.description}</p>
                      <p className="text-sm text-gray-600">
                        <strong>Use when:</strong> {pattern.useCase}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Structural Patterns */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  Structural Patterns
                </h3>
                <p className="text-gray-600 mb-4 text-sm">
                  These patterns explain how to assemble objects and classes into larger structures while keeping these structures flexible and efficient.
                </p>
                <div className="space-y-6">
                  {designPatterns.structural.map((pattern, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">{pattern.name}</h4>
                      <p className="text-gray-700 mb-2">{pattern.description}</p>
                      <p className="text-sm text-gray-600">
                        <strong>Use when:</strong> {pattern.useCase}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Behavioral Patterns */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  Behavioral Patterns
                </h3>
                <p className="text-gray-600 mb-4 text-sm">
                  These patterns are concerned with algorithms and the assignment of responsibilities between objects.
                </p>
                <div className="space-y-6">
                  {designPatterns.behavioral.map((pattern, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">{pattern.name}</h4>
                      <p className="text-gray-700 mb-2">{pattern.description}</p>
                      <p className="text-sm text-gray-600">
                        <strong>Use when:</strong> {pattern.useCase}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        );

      case 'best-practices':
        return (
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Best Practices</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Start with requirements clarification</li>
              <li>Identify core entities and their relationships</li>
              <li>Design for extensibility and maintainability</li>
              <li>Consider edge cases and error handling</li>
              <li>Use appropriate data structures</li>
              <li>Write clean, readable code</li>
              <li>Think about scalability and performance</li>
              <li>Follow naming conventions consistently</li>
              <li>Document your design decisions</li>
              <li>Consider thread safety if applicable</li>
              <li>Design for testability</li>
              <li>Keep classes and methods focused and small</li>
            </ul>
          </section>
        );

      case 'interview-questions':
        return (
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Common Interview Questions</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Design a Parking Lot System</li>
              <li>Design a Library Management System</li>
              <li>Design a Snake and Ladder Game</li>
              <li>Design a Tic-Tac-Toe Game</li>
              <li>Design a URL Shortener</li>
              <li>Design a Cache System</li>
              <li>Design a Rate Limiter</li>
              <li>Design a Logging System</li>
              <li>Design a File System</li>
              <li>Design a Social Media Feed</li>
              <li>Design a Notification System</li>
              <li>Design a Task Scheduler</li>
            </ul>
          </section>
        );

      default:
        return null;
    }
  };

  const sidebarItems = [
    { id: 'introduction' as Section, label: 'Introduction' },
    { id: 'principles' as Section, label: 'Key Principles' },
    { id: 'design-patterns' as Section, label: 'Design Patterns' },
    { id: 'best-practices' as Section, label: 'Best Practices' },
    { id: 'interview-questions' as Section, label: 'Interview Questions' }
  ];

  return (
    <ProtectedRoute>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="flex">
          {/* Sidebar */}
          <aside className="w-64 bg-white border-r border-gray-200 min-h-screen sticky top-0 h-screen overflow-y-auto">
            <div className="p-4">
              <h1 className="text-xl font-bold text-gray-900 mb-6">LLD Theory</h1>
              <nav className="space-y-1">
                {sidebarItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                      activeSection === item.id
                        ? 'bg-gray-100 text-gray-900 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
              <div className="bg-white rounded-lg shadow p-6">
                {renderContent()}
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}

