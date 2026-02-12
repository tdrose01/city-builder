      {/* Phase 10: Global 3D Scene */}
      <GameScene>
        <group position={[0, 2.5, 0]}>
          <DiceGroup rolling={rolling} value1={die1Value} value2={die2Value} />
        </group>
        <InstancedParticles ref={particleSystemRef} />
        <Board3D 
          ref={board3DRef} 
          tiles={tiles} 
          playerPosition={playerPosition} 
          playerTargetPosition={playerTargetPosition}
          isMoving={isMoving} 
          themeColor={cityData.themeColor}
          onTileClick={(tileId) => {
            // Handle tile clicks from 3D board
            const tile = tiles.find(t => t.id === tileId);
            if (tile && tile.type === 'Landmark' && tile.level < tile.maxLevel && playerPosition === tileId) {
              handleUpgradeLandmark();
            }
          }}
        />
        <VFXManager ref={vfxRef} />
      </GameScene>